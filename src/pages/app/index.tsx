import { type ChangeEvent, useState } from "react";
import { api } from "~/utils/api";

const App = () => {
  const utils = api.useContext();
  const [value, setValue] = useState("");
  const { data: remindersData } = api.reminders.getAll.useQuery();
  const { mutate: addReminder } = api.reminders.add.useMutation({
    onSuccess: () => utils.reminders.getAll.invalidate(),
  });
  const { mutate: completeReminder } = api.reminders.complete.useMutation({
    onSuccess: () => utils.reminders.getAll.invalidate(),
  });

  return (
    <main>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addReminder({ text: value });
          setValue("");
        }}
      >
        <input
          className="border border-solid border-black"
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setValue(event.target.value)
          }
          value={value}
        />
        <button type="submit">Add</button>
      </form>
      {remindersData?.reminders
        .sort((a, b) =>
          (a?.completedAt ?? 0) > (b?.completedAt ?? 0) ? -1 : 1
        )
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .sort((a, b) => (a.completed ? 1 : b.completed ? -1 : 0))

        .map((reminder) => (
          // TODO: Update from div to actual button element once implementing a ui libray
          <div
            key={reminder.id}
            className={
              reminder.completed
                ? "cursor-default line-through"
                : "cursor-pointer"
            }
            {...(reminder.completed
              ? {}
              : { onClick: () => completeReminder(reminder.id) })}
          >
            {reminder.text}
          </div>
        ))}
    </main>
  );
};

export default App;

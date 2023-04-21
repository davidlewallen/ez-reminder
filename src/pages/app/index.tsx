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
  const { mutate: deleteReminder } = api.reminders.delete.useMutation({
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
          ref={(node) => node?.focus()}
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
          <div key={reminder.id}>
            <span
              className={`
              ${
                reminder.completed
                  ? "cursor-default line-through"
                  : "cursor-pointer"
              } mr-2 p-1`}
            >
              {reminder.text}
            </span>
            {!reminder.completed && (
              <button
                className="mr-2 border border-solid border-black p-1"
                onClick={() => completeReminder(reminder.id)}
              >
                Complete
              </button>
            )}

            <button
              className="border border-solid border-black p-1"
              onClick={() => deleteReminder(reminder.id)}
            >
              Delete
            </button>
          </div>
        ))}
    </main>
  );
};

export default App;

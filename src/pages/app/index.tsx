import { type ChangeEvent, useState } from "react";
import { api } from "~/utils/api";

const App = () => {
  const utils = api.useContext();
  const [value, setValue] = useState("");
  const { mutate: addReminder } = api.reminders.add.useMutation({
    onSuccess: () => utils.reminders.getAll.invalidate(),
  });
  const { data: remindersData } = api.reminders.getAll.useQuery();

  return (
    <main>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addReminder({ text: value });
        }}
      >
        <input
          className="border border-solid border-black"
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setValue(event.target.value)
          }
        />
        <button type="submit">Add</button>
      </form>
      {remindersData?.reminders.map((reminder) => (
        <div key={reminder.id}>{reminder.text}</div>
      ))}
    </main>
  );
};

export default App;

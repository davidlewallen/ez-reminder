import { type ChangeEvent, useState } from "react";
import { api } from "~/utils/api";

const App = () => {
  const [value, setValue] = useState("");
  const { mutate: addReminder } = api.reminders.add.useMutation();

  return (
    <main>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(value);
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
    </main>
  );
};

export default App;

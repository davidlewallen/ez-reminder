import { DeleteIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Checkbox,
  IconButton,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { type RouterOutputs, api } from "~/utils/api";

const Reminders = () => {
  const { data: reminders } = api.reminders.getAll.useQuery();

  return (
    <div className="scroll -mr-2 h-full overflow-y-scroll ">
      <Stack>
        {reminders
          ?.sort((a, b) =>
            (a?.completedAt ?? 0) > (b?.completedAt ?? 0) ? -1 : 1
          )
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .sort((a, b) => (a.completed ? 1 : b.completed ? -1 : 0))
          .map((reminder) => (
            <Reminder key={reminder.id} reminder={reminder} />
          ))}
      </Stack>
    </div>
  );
};

export default Reminders;

type Reminders = RouterOutputs["reminders"]["getAll"];
type Reminder = Reminders[number];

export function Reminder({ reminder }: { reminder: Reminder }) {
  const utils = api.useContext();
  const { mutate: completeReminder } = api.reminders.complete.useMutation({
    async onMutate(id) {
      await utils.reminders.getAll.cancel();

      const prevData = utils.reminders.getAll.getData();

      utils.reminders.getAll.setData(undefined, (old) =>
        (old ?? []).map((reminder) =>
          reminder.id === id
            ? { ...reminder, completed: !reminder.completed }
            : reminder
        )
      );

      return { prevData };
    },
    onError(error, variables, context) {
      utils.reminders.getAll.setData(undefined, context?.prevData ?? []);
    },
    onSettled: () => utils.reminders.getAll.invalidate(),
  });
  const { mutate: deleteReminder } = api.reminders.delete.useMutation({
    async onMutate(id) {
      await utils.reminders.getAll.cancel();

      const prevData = utils.reminders.getAll.getData();

      utils.reminders.getAll.setData(undefined, (old) =>
        (old ?? []).filter((reminder) => reminder.id !== id)
      );

      return { prevData };
    },
    onError(error, variables, context) {
      utils.reminders.getAll.setData(undefined, context?.prevData ?? []);
    },
    onSettled: () => utils.reminders.getAll.invalidate(),
  });

  return (
    <Card>
      <CardBody
        display="flex"
        alignItems="center"
        onChange={() => completeReminder(reminder.id)}
      >
        <Checkbox isChecked={reminder.completed} marginRight="4" />

        {reminder.text}

        <Spacer />

        <IconButton
          icon={<DeleteIcon />}
          aria-label="delete reminder"
          colorScheme="red"
          onClick={() => deleteReminder(reminder.id)}
        />
      </CardBody>
    </Card>
  );
}

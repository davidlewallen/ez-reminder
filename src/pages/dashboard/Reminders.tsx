import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Card,
  CardBody,
  IconButton,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { useCompleteReminder } from "~/hooks/use-complete-reminder";
import { useDeleteReminder } from "~/hooks/use-delete-reminder";
import { type RouterOutputs, api } from "~/utils/api";

const Reminders = () => {
  const { data: reminders } = api.reminders.getAll.useQuery();

  return (
    <div className="scroll -mr-2 h-full overflow-y-scroll ">
      <Stack>
        {reminders
          ?.filter((reminder) => !reminder.completed)
          .sort((a, b) =>
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
  const { mutate: completeReminder } = useCompleteReminder();
  const { mutate: deleteReminder } = useDeleteReminder();

  return (
    <Card>
      <CardBody display="flex" alignItems="center">
        {reminder.text}

        <Spacer />

        <ButtonGroup>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="delete reminder"
            colorScheme="red"
            onClick={() => deleteReminder(reminder.id)}
          />
          <IconButton
            icon={<CheckIcon />}
            aria-label="complete reminder"
            colorScheme="green"
            onClick={() => completeReminder(reminder.id)}
          />
        </ButtonGroup>
      </CardBody>
    </Card>
  );
}

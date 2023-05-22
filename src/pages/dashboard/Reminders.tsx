import { CheckIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  Collapse,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useCompleteReminder } from "~/hooks/use-complete-reminder";
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

type UnitOfTime = "minute" | "minutes" | "hour" | "hours" | "day" | "days";

const msInSecond = 1000 / 1;

function useDeleteReminder() {
  const utils = api.useContext();

  return api.reminders.delete.useMutation({
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
}

function useSnoozeReminder() {
  const utils = api.useContext();

  return api.reminders.snooze.useMutation({
    async onMutate(id) {
      await utils.reminders.getAll.cancel();

      const prevData = utils.reminders.getAll.getData();

      utils.reminders.getAll.setData(undefined, (old) =>
        (old ?? []).map((reminder) =>
          reminder.id === id
            ? { ...reminder, remindAt: reminder.nextRemindAt }
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
}

export function Reminder({ reminder }: { reminder: Reminder }) {
  const { mutate: completeReminder } = useCompleteReminder();
  const { mutate: deleteReminder } = useDeleteReminder();
  const { mutate: snoozeReminder } = useSnoozeReminder();
  const { isOpen, onToggle } = useDisclosure();

  const genSnoozeCopy = () => {
    let snoozeCopy = 0;
    let timeUnit: UnitOfTime = "minute";

    const currentTime = new Date();
    const timeToReminderMs =
      (reminder.remindAt?.getTime() ?? 0) - currentTime.getTime();
    const minutesToReminder = Math.max(timeToReminderMs / msInSecond / 60, 0);
    const hoursToReminder = minutesToReminder / 60;
    const daysToReminder = hoursToReminder / 24;
    const minutesToReminderRounded = Math.round(minutesToReminder);
    const hoursToReminderRounded = Math.round(hoursToReminder);
    const daysToReminderRounded = Math.round(daysToReminder);

    if (daysToReminderRounded === 1) {
      snoozeCopy = daysToReminderRounded;
      timeUnit = "day";
    } else if (daysToReminderRounded > 1) {
      snoozeCopy = daysToReminderRounded;
      timeUnit = "days";
    } else if (hoursToReminderRounded === 1) {
      snoozeCopy = hoursToReminderRounded;
      timeUnit = "hour";
    } else if (hoursToReminderRounded > 1) {
      snoozeCopy = hoursToReminderRounded;
      timeUnit = "hours";
    } else if (minutesToReminderRounded === 1) {
      snoozeCopy = minutesToReminderRounded;
      timeUnit = "minute";
    } else if (minutesToReminderRounded > 1) {
      snoozeCopy = minutesToReminderRounded;
      timeUnit = "minutes";
    }

    return `Snoozed for ${snoozeCopy} ${timeUnit}`;
  };

  return (
    <Card>
      <CardBody display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" onClick={onToggle}>
          <Text>{reminder.text}</Text>

          {reminder.remindAt ? (
            <Text fontSize="xs">{genSnoozeCopy()}</Text>
          ) : (
            false
          )}
        </Box>
        <Collapse in={isOpen}>
          <Box display="flex" justifyContent="flex-end">
            <ButtonGroup>
              <IconButton
                size="sm"
                icon={<TimeIcon />}
                aria-label="snooze reminder"
                colorScheme="blue"
                onClick={() => snoozeReminder(reminder.id)}
              />
              <IconButton
                size="sm"
                icon={<DeleteIcon />}
                aria-label="delete reminder"
                colorScheme="red"
                onClick={() => deleteReminder(reminder.id)}
              />
              <IconButton
                size="sm"
                icon={<CheckIcon />}
                aria-label="complete reminder"
                colorScheme="green"
                onClick={() => completeReminder(reminder.id)}
              />
            </ButtonGroup>
          </Box>
        </Collapse>
      </CardBody>
    </Card>
  );
}

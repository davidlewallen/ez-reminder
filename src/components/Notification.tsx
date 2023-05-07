import { CheckIcon, CloseIcon, MoonIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { type RouterOutputs } from "~/utils/api";

type Reminders = RouterOutputs["reminders"]["getAll"];
type Reminder = Reminders[number];

interface Props {
  reminder: Reminder;
  handleComplete: (reminderId: Reminder["id"]) => void;
  handleDismiss: (reminderId: Reminder["id"]) => void;
  handleSnooze: (reminderId: Reminder["id"]) => void;
}

export const Notification = ({
  reminder,
  handleComplete,
  handleDismiss,
  handleSnooze,
}: Props) => (
  <Card>
    <CardBody display="flex" flexDirection="column">
      <Box marginBottom="2">
        <Text fontWeight="medium">{reminder.text}</Text>
      </Box>
      <ButtonGroup>
        <IconButton
          icon={<MoonIcon />}
          aria-label="snooze reminder"
          colorScheme="blue"
          onClick={() => handleSnooze(reminder.id)}
        />
        <IconButton
          icon={<CloseIcon />}
          aria-label="dismiss reminder"
          colorScheme="red"
          onClick={() => handleDismiss(reminder.id)}
        />
        <IconButton
          icon={<CheckIcon />}
          aria-label="complete reminder"
          colorScheme="green"
          onClick={() => handleComplete(reminder.id)}
        />
      </ButtonGroup>
    </CardBody>
  </Card>
);

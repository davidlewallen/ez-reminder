import { CheckIcon, CloseIcon, MoonIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  IconButton,
  Text,
  type ToastId,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { type RouterOutputs } from "~/utils/api";

type Reminders = RouterOutputs["reminders"]["getAll"];
type Reminder = Reminders[number];

export const useNotification = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId[]>([]);

  const handleSnooze = useCallback(
    (reminderId: ToastId) => {
      // Do something with snooze
      if (toastIdRef.current.includes(reminderId)) toast.close(reminderId);
    },
    [toast]
  );

  const handleDismiss = useCallback(
    (reminderId: ToastId) => {
      // Do something with dismiss
      if (toastIdRef.current.includes(reminderId)) toast.close(reminderId);
    },
    [toast]
  );

  const handleComplete = useCallback(
    (reminderId: ToastId) => {
      // Do something with complete
      if (toastIdRef.current.includes(reminderId)) toast.close(reminderId);
    },
    [toast]
  );

  const generateNotification = (reminder: Reminder) => {
    if (!toast.isActive(reminder.id)) {
      toastIdRef.current.push(
        toast({
          duration: null,
          id: reminder.id,
          position: "top-right",
          render: () => (
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
          ),
        })
      );
    }
  };

  return {
    createNotification: useCallback(generateNotification, [
      handleComplete,
      handleDismiss,
      handleSnooze,
      toast,
    ]),
  };
};

import { useToast, type ToastId } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import { Notification } from "~/components/Notification";
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
            <Notification
              reminder={reminder}
              handleComplete={handleComplete}
              handleDismiss={handleDismiss}
              handleSnooze={handleSnooze}
            />
          ),
        })
      );
    }
  };

  useEffect(
    () => () => {
      if (toastIdRef.current.length)
        toastIdRef.current.forEach((reminderId) => toast.close(reminderId));
    },
    [toast]
  );
  return {
    createNotification: useCallback(generateNotification, [
      handleComplete,
      handleDismiss,
      handleSnooze,
      toast,
    ]),
  };
};

import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import { Notification } from "~/components/Notification";
import { api, type RouterOutputs } from "~/utils/api";

type Reminders = RouterOutputs["reminders"]["getAll"];
type Reminder = Reminders[number];

export const useNotification = () => {
  const toast = useToast();
  const notificationIntervalRef = useRef<
    { toastId: string; timeoutId: number }[]
  >([]);
  const { data: reminders } = api.reminders.getWithRemindAt.useQuery(
    undefined,
    {
      refetchInterval: 1000 * 60,
      select(data) {
        return data.filter(
          (reminder) => reminder.remindAt || !reminder.completed
        );
      },
    }
  );
  const { mutate: completeReminder } = api.reminders.complete.useMutation();
  const { mutate: dismissReminder } = api.reminders.dismiss.useMutation();
  const { mutate: snoozeReminder } = api.reminders.snooze.useMutation();

  const handleSnooze = useCallback(
    (reminderId: string) => {
      if (
        notificationIntervalRef.current.some(
          (notificationInterval) => notificationInterval.toastId === reminderId
        )
      ) {
        toast.close(reminderId);
        snoozeReminder(reminderId);
      }
    },
    [snoozeReminder, toast]
  );

  const handleDismiss = useCallback(
    (reminderId: string) => {
      if (
        notificationIntervalRef.current.some(
          (notificationInterval) => notificationInterval.toastId === reminderId
        )
      ) {
        toast.close(reminderId);
        dismissReminder(reminderId);
      }
    },
    [dismissReminder, toast]
  );

  const handleComplete = useCallback(
    (reminderId: string) => {
      if (
        notificationIntervalRef.current.some(
          (notificationInterval) => notificationInterval.toastId === reminderId
        )
      ) {
        toast.close(reminderId);
        completeReminder(reminderId);
      }
    },
    [completeReminder, toast]
  );

  const generateNotification = useCallback(
    (reminder: Reminder) => {
      if (
        !reminder.remindAt ||
        toast.isActive(reminder.id) ||
        notificationIntervalRef.current.some(
          (notificationInterval) => notificationInterval.toastId === reminder.id
        )
      )
        return;

      const currentTime = new Date();
      const secondsUntilReminder = Math.floor(
        reminder.remindAt.getTime() - currentTime.getTime()
      );

      notificationIntervalRef.current.push({
        toastId: reminder.id,
        timeoutId: window.setTimeout(() => {
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
          });
        }, secondsUntilReminder),
      });
    },
    [handleComplete, handleDismiss, handleSnooze, toast]
  );

  useEffect(() => {
    if (reminders?.length) {
      reminders.forEach(generateNotification);
    }
  }, [generateNotification, reminders]);

  useEffect(
    () => () =>
      notificationIntervalRef.current.forEach((notificationIntervalRef) =>
        clearTimeout(notificationIntervalRef.timeoutId)
      ),
    []
  );
};

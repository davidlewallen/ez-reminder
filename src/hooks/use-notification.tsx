import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import { Notification } from "~/components/Notification";
import { api, type RouterOutputs } from "~/utils/api";
import { useCompleteReminder } from "./use-complete-reminder";

type Reminders = RouterOutputs["reminders"]["getAll"];
type Reminder = Reminders[number];

export const useNotification = (disable = false) => {
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
      enabled: !disable,
    }
  );
  const { mutate: completeReminder } = useCompleteReminder();
  const { mutate: dismissReminder } = useDismissReminder();
  const { mutate: snoozeReminder } = useSnoozeReminder();

  const handleAction = useCallback(
    (
      reminderId: string,
      action:
        | typeof completeReminder
        | typeof dismissReminder
        | typeof snoozeReminder
    ) => {
      if (
        notificationIntervalRef.current.some(
          (notificationInterval) => notificationInterval.toastId === reminderId
        )
      ) {
        toast.close(reminderId);
        action(reminderId);
      }
    },
    [toast]
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
      const isReminderInThePast =
        reminder.remindAt.getTime() < currentTime.getTime();
      const secondsUntilReminder = isReminderInThePast
        ? 0
        : Math.floor(reminder.remindAt.getTime() - currentTime.getTime());

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
                handleComplete={(reminderId) =>
                  handleAction(reminderId, completeReminder)
                }
                handleDismiss={(reminderId) =>
                  handleAction(reminderId, dismissReminder)
                }
                handleSnooze={(reminderId) =>
                  handleAction(reminderId, snoozeReminder)
                }
              />
            ),
          });
        }, secondsUntilReminder),
      });
    },
    [completeReminder, dismissReminder, handleAction, snoozeReminder, toast]
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

function useSnoozeReminder() {
  const utils = api.useContext();

  return api.reminders.snooze.useMutation({
    async onMutate(reminderId) {
      await utils.reminders.getAll.cancel();

      const prevData = utils.reminders.getAll.getData();

      utils.reminders.getAll.setData(undefined, (old) =>
        (old ?? []).map((reminder) => {
          if (reminder.id === reminderId) {
            return {
              ...reminder,
              remindAt: reminder.nextRemindAt,
            };
          }

          return reminder;
        })
      );

      return { prevData };
    },
    onError(error, variables, context) {
      utils.reminders.getAll.setData(undefined, context?.prevData ?? []);
    },
    onSettled() {
      void utils.reminders.getAll.invalidate();
    },
  });
}

function useDismissReminder() {
  const utils = api.useContext();

  return api.reminders.dismiss.useMutation({
    async onMutate(reminderId) {
      await utils.reminders.getAll.cancel();

      const prevData = utils.reminders.getAll.getData();

      utils.reminders.getAll.setData(undefined, (old) =>
        (old ?? []).map((reminder) => {
          if (reminder.id === reminderId) {
            return {
              ...reminder,
              remindAt: null,
              nextRemindAt: null,
            };
          }

          return reminder;
        })
      );

      return { prevData };
    },
    onError(error, variables, context) {
      utils.reminders.getAll.setData(undefined, context?.prevData ?? []);
    },
    onSettled() {
      void utils.reminders.getAll.invalidate();
    },
  });
}

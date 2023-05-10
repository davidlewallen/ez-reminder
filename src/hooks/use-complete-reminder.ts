import { api } from "~/utils/api";

export const useCompleteReminder = () => {
  const utils = api.useContext();

  return api.reminders.complete.useMutation({
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
};

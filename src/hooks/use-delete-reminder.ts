import { api } from "~/utils/api";

export const useDeleteReminder = () => {
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
};

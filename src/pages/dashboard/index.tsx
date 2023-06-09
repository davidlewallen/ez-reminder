import { useState } from "react";
import { Card, CardBody, Flex, IconButton, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { api } from "~/utils/api";
import Reminders from "./Reminders";
import { Layout } from "~/components/Layout";
import { useProtectedRoute } from "~/hooks";

const App = () => {
  useProtectedRoute();
  const utils = api.useContext();
  const [value, setValue] = useState("");
  const { mutate: addReminder } = api.reminders.add.useMutation({
    async onMutate(newReminder) {
      await utils.reminders.getAll.cancel();

      const prevData = utils.reminders.getAll.getData();

      utils.reminders.getAll.setData(undefined, (old) => [
        ...(old ?? []),
        {
          id: Date.now().toString(),
          text: newReminder.text,
          completed: false,
          createdAt: new Date(),
          userId: "1",
          completedAt: null,
          remindAt: null,
          nextRemindAt: null,
        },
      ]);

      return { prevData };
    },
    onSettled: () => utils.reminders.getAll.invalidate(),
  });

  return (
    <Layout>
      <Card marginBottom="2">
        <CardBody>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addReminder({ text: value });
              setValue("");
            }}
          >
            <Flex>
              <Input
                isRequired
                marginRight={2}
                ref={(node) => node?.focus()}
                type="text"
                onChange={(event) => setValue(event.target.value)}
                value={value}
                placeholder="Add a reminder"
              />
              <IconButton
                aria-label="Add reminder"
                colorScheme="green"
                type="submit"
                icon={<AddIcon />}
              />
            </Flex>
          </form>
        </CardBody>
      </Card>

      <Reminders />
    </Layout>
  );
};

export default App;

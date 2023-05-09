import { Container } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { useNotification } from "~/hooks/use-notification";

export const Layout = ({ children }: { children: ReactNode }) => {
  useNotification();

  return (
    <Navbar>
      <Container height="100%" overflow="hidden">
        <main className="h-full overflow-hidden">{children}</main>
      </Container>
    </Navbar>
  );
};

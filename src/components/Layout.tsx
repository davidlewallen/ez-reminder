import { Container } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { useNotification } from "~/hooks/use-notification";

export const Layout = ({
  children,
  hideNavbar = false,
}: {
  children: ReactNode;
  hideNavbar?: boolean;
}) => {
  useNotification(hideNavbar);

  return hideNavbar ? (
    <Container height="100%" overflow="hidden">
      <main className="h-full overflow-hidden">{children}</main>
    </Container>
  ) : (
    <Navbar>
      <Container height="100%" overflow="hidden">
        <main className="h-full overflow-hidden">{children}</main>
      </Container>
    </Navbar>
  );
};

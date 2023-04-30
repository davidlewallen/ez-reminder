import { Container } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: ReactNode }) => (
  <Navbar>
    <Container height="100%" overflow="hidden">
      <main className="h-full overflow-hidden">{children}</main>
    </Container>
  </Navbar>
);

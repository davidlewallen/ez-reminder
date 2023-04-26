import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, Container } from "@chakra-ui/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Container height="100%" overflow="hidden">
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

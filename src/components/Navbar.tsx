import { type ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { signOut, useSession } from "next-auth/react";

const Links = ["Dashboard"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export const Navbar = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useSession();

  return (
    <Box height="100%" overflowX="hidden">
      <Box bg={useColorModeValue("white", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>EZ Reminders</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {/* <Button */}
            {/*   variant={"solid"} */}
            {/*   colorScheme={"teal"} */}
            {/*   size={"sm"} */}
            {/*   mr={4} */}
            {/*   leftIcon={<AddIcon />} */}
            {/* > */}
            {/*   Action */}
            {/* </Button> */}
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={data?.user.image ?? ""}
                  crossOrigin="anonymous"
                />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    void signOut({ callbackUrl: window.location.origin })
                  }
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box
        height="calc(100% - 64px)"
        bg={useColorModeValue("gray.100", "black")}
        paddingTop="4"
      >
        {children}
      </Box>
    </Box>
  );
};

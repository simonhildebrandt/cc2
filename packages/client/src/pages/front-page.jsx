import { useContext } from "react";
import { Heading, Flex, Text } from "@chakra-ui/react";

import { AuthContext } from "../services/auth-provider";
import Layout from "../components/layout";
import Link from "../components/link";

export default function FrontPage() {
  const { isAuthenticated, loginLink } = useContext(AuthContext);

  return (
    <Layout authed={false}>
      <Flex p="10" direction="column" alignItems="center" gap={4}>
        <Heading>Welcome to ClockCamera!</Heading>
        <Text>
          ClockCamera helps you build engaging clocks using photos to represent
          the visual components.
        </Text>
        {isAuthenticated ? (
          <Text>
            Click here to{" "}
            <Link variant="underline" colorPalette="teal" to="/clocks">
              work on your clocks
            </Link>
            .
          </Text>
        ) : (
          <Link variant="underline" colorPalette="teal" to={loginLink}>
            Login to get started
          </Link>
        )}
      </Flex>
    </Layout>
  );
}

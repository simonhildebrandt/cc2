import { useContext, useEffect } from "react";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router";

import { AuthContext } from "../services/auth-provider";
import Link from "../components/link";
import { ColorModeButton } from "../components/ui/color-mode";

export default function ({ children, authed = false }) {
  const { pb, loginLink, isAuthenticated, user, logout, login } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authed && !isAuthenticated) {
      navigate(
        "/?from=" + encodeURIComponent(location.pathname + location.search)
      );
    }
  }, [authed, isAuthenticated]);

  return (
    <Flex width="100%" height="100%" flexDirection="column">
      <Flex
        bgColor="bg.emphasized"
        flexDirection="row"
        justifyContent="space-between"
        padding="4"
        align="center"
      >
        <Heading>
          <Link to="/">ClockCamera</Link>
        </Heading>
        <Flex gap={4} align="center">
          {isAuthenticated ? (
            <Flex>
              <Button variant="surface" onClick={logout}>
                Logout
              </Button>
            </Flex>
          ) : (
            <Link to={loginLink}>Login</Link>
          )}
          <ColorModeButton />
        </Flex>
      </Flex>
      <Flex flexGrow={1} flexDirection="column" padding="4">
        {children}
      </Flex>
    </Flex>
  );
}

/*
// Login dialog
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  function handleLogin() {
    login({ username, password }).catch((error) => {
      setError("Login failed. Please check your credentials.");
    });
  }

  function updateUsername(event) {
    setUsername(event.target.value);
    setError(null);
  }

  function updatePassword(event) {
    setPassword(event.target.value);
    setError(null);
  }

  function updateLoginDialogOpen({ open }) {
    setLoginDialogOpen(open);
  }


<Dialog.Root
            open={loginDialogOpen}
            onOpenChange={updateLoginDialogOpen}
          >
            <Dialog.Trigger asChild>
              <Button>Login</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.CloseTrigger />
                <Dialog.Header>
                  <Dialog.Title>Login</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Fieldset.Root size="lg" maxW="md" invalid={!!error}>
                    <Stack>

                      <Fieldset.HelperText>
                        Enter your username and password below.
                      </Fieldset.HelperText>
                    </Stack>
                    <Fieldset.Content>
                      <Field.Root invalid={!!error}>
                        <Field.Label>Username</Field.Label>
                        <Input
                          value={username}
                          placeholder="Username"
                          id="username"
                          onChange={updateUsername}
                        />
                      </Field.Root>

                      <Field.Root invalid={!!error}>
                        <Field.Label>Password</Field.Label>
                        <Input
                          type="password"
                          value={password}
                          placeholder="Password"
                          onChange={updatePassword}
                        />
                      </Field.Root>
                    </Fieldset.Content>
                    <Fieldset.ErrorText>
                      Some fields are invalid. Please check them.
                    </Fieldset.ErrorText>
                  </Fieldset.Root>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    onClick={handleLogin}
                    type="submit"
                    alignSelf="flex-start"
                  >
                    Submit
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>

        */

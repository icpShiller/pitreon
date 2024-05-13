import { Spinner, Button } from '@chakra-ui/react';
import { useInternetIdentity } from "ic-use-internet-identity";

export function LoginButton() {
  const { isLoggingIn, login, clear, identity } = useInternetIdentity();

  // If the user is logged in, clear the identity. Otherwise, log in.
  function handleClick() {
    if (identity) {
      clear();
    } else {
      login();
    }
  }

  const text = () => {
    if (identity) {
      return "Logout";
    } else if (isLoggingIn) {
      return (
        <>
          Logging in
          <Spinner />
        </>
      );
    }
    return "Login with Internet Identity";
  };

  const variant = identity ? 'outline' : 'solid';

  return (
    <Button colorScheme='teal' variant={variant} onClick={handleClick} disabled={isLoggingIn}>
      {text()}
    </Button>
  );
}

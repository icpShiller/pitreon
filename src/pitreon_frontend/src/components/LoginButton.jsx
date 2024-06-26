import { Menu, MenuList, MenuButton, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useInternetIdentity } from "ic-use-internet-identity";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useActor } from '../ic/Actors';
import { CiUser } from "react-icons/ci";

function ellipsis(string) {
    return string != undefined ? string.substring(0, 9) + '...' : '';
}

export function LoginButton() {
    const { isLoggingIn, login, clear, identity, loginStatus } = useInternetIdentity();
    const { actor } = useActor();
    const [principal, setPrincipal] = useState(null);
    const [profileLink, setProfileLink] = useState('/#');
    const [profileLinkDisabled, setProfileLinkDisabled] = useState(true);
    const navigate = useNavigate();

    // Clear the principal when the identity is cleared
    useEffect(() => {
        if (!identity) setPrincipal(undefined);
      }, [identity]);
  
    // Get the principal from the backend when an identity is available
    useEffect(() => {
        if (actor && identity) {
            actor.getProfileLink().then(
                (result) => { 
                    setProfileLink(result);
                    setProfileLinkDisabled(false);
                }
            ).catch((error) => {
                console.log(error)
            });
            if (!principal) {
                setPrincipal(identity.getPrincipal().toText())
            }
        }
    }, [actor, principal]);

    function handleLogout() {
        clear()
        navigate(0)
    }
  
    if (identity) {
        return (
            <Menu>
                <MenuButton as={Button} leftIcon={<CiUser />} rightIcon={<ChevronDownIcon />} width={'180px'}>
                    {ellipsis(principal)}
                </MenuButton>
                <MenuList>
                    <MenuItem as='a' href={profileLink} disabled={profileLinkDisabled}>
                        My patreon page
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        );
    } else {
        return (
            <Button onClick={login} isLoading={isLoggingIn} loadingText='Logging in' colorScheme='teal'>Login with Internet Identity</Button>
        );
    }
}

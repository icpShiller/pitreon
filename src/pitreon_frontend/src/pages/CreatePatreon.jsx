import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, HStack, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { useActor } from "../ic/Actors";
import { useInternetIdentity } from "ic-use-internet-identity";

export default function CreatePatreon() {
    const { actor } = useActor();
    const { identity } = useInternetIdentity();
    const [input, setInput] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [longEnough, setLongEnough] = useState(true);
    const [shortEnough, setShortEnough] = useState(true);
    const [alphanumeric, setAlphanumeric] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // Check if authenticated
    useEffect(() => {
        if (actor && identity) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [actor, identity]);

    function handleClick(e) {  
        e.preventDefault();
        setIsCreating(true);
        actor.addPatron(input).then((message) => {
            if (message.length == 0) {
                setIsCreating(false);
                toast({
                    title: 'Failed to create a patreon page.',
                    description: "Looks like the patreon page already exists for this principal.",
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                });
            } else {
                navigate('/profile/'+message[0]);
            }
        }).catch((error) => {
            setIsCreating(false);
            toast({
                title: 'Failed to create a patreon page.',
                description: "An unknown error occured. Please try again later.",
                status: 'error',
                duration: 8000,
                isClosable: true,
            });
        });
        return false;
    }

    function handleInputChange(e) {
        let newInput = e.target.value;
        setInput(newInput);
        if (isLongEnough(newInput)) {
            setLongEnough(true);
            if (isShortEnough(newInput)) {
                setShortEnough(true);
                if (isValidInput(newInput)) {
                    setAlphanumeric(true);
                    setSubmitDisabled(false);
                } else {
                    setAlphanumeric(false);
                    setSubmitDisabled(true);
                }
            } else {
                setShortEnough(false);
                setSubmitDisabled(true);
            }
        } else {
            setLongEnough(false);
            setSubmitDisabled(true);
        }
    }

    const isValidInput = str => /^[a-z0-9 ]*$/gi.test(str);
    const isLongEnough = str => str.length > 2;
    const isShortEnough = str => str.length < 30;
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus the input element on page load
        inputRef.current.focus();
      }, []);

    return (
        <Layout>
            <Grid templateColumns='repeat(9, 1fr)' pt={1}>
                <GridItem colSpan={2} />
                <GridItem colSpan={5} >
                    <Heading as='h3' size='lg' pb={3}>Create a patreon page</Heading>
                    <FormControl isInvalid={!authenticated}>
                        <FormLabel>Choose a patreon name:</FormLabel>
                        <HStack>
                            <Input isDisabled={!authenticated} placeholder='Enter your desired name' ref={inputRef} value={input} onChange={handleInputChange} required/>
                            <Button isLoading={isCreating} loadingText='Creating' colorScheme='purple' onClick={handleClick} isDisabled={submitDisabled}>Create</Button>
                        </HStack>
                        {!longEnough && authenticated ? (
                            <FormHelperText>
                                3 characters minimum.
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                        {!shortEnough && authenticated ? (
                            <FormHelperText>
                                30 characters maximum.
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                        {!alphanumeric && authenticated ? (
                            <FormHelperText>
                                Only alphanumerical characters and spaces are allowed.
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                        {!authenticated ? (
                            <FormErrorMessage>
                                You need to be logged in.
                            </FormErrorMessage>
                        ) : (
                            <></>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem colSpan={2} />
            </Grid>
        </Layout>
    );
}
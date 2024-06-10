import { useEffect, useState } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { Button, Center, Grid, GridItem, HStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Image, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, FormControl, FormLabel, FormHelperText, useToast, Textarea } from '@chakra-ui/react'
import { useActor } from '../ic/Actors';
import Layout from '../components/Layout';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { IconContext } from "react-icons";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { pitreon_backend } from '../../../declarations/pitreon_backend';
import { StateText } from '../components/StateText';
import { StateHeading } from '../components/StateHeading';
// ICP balance, transfers, etc.
//import { icp_ledger_canister } from '../../../declarations/icp_ledger_canister';
import { createAgent } from "@dfinity/utils";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from '@dfinity/principal';
//import { Buffer } from 'buffer/';
//globalThis.Buffer = Buffer;

export function loader({ params }) {
    return { params };
}

export default function Profile() {
    const { actor } = useActor();
    const { params } = useLoaderData();
    const { identity } = useInternetIdentity();
    const [principal, setPrincipal] = useState(null);
    const [name, setName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [fullDescription, setFullDescription] = useState('');
    const [xAccount, setXAccount] = useState('');
    const [ytAccount, setYtAccount] = useState('');
    const [followerCount, setFollowerCount] = useState(0);
    const [supporterCount, setSupporterCount] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pageOwnership, setPageOwnership] = useState('undetermined');
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
    const { isOpen: isDescriptionOpen, onOpen: onDescriptionOpen, onClose: onDescriptionClose } = useDisclosure();
  
    // Get profile page information
    useEffect(() => {
        pitreon_backend.getPatronInfo(params.profileId)
        .then((content) => {
            if (content.length === 0) {
                navigate("/not-found");
            }
            setName(content[0].name);
            setShortDescription(content[0].shortDescription);
            setFullDescription(content[0].fullDescription);
            setXAccount(content[0].xAccount);
            setYtAccount(content[0].ytAccount);
            setFollowerCount(parseInt(content[0].followerCount));
            setSupporterCount(parseInt(content[0].supporterCount));
            setNameInForm(name);
            setShortDescriptionInForm(shortDescription);
            setFullDescriptionInForm(fullDescription);
            setXAccountInForm(xAccount);
            setYtAccountInForm(ytAccount);
            setDataLoaded(true);
        }).catch((error) => {
            navigate("/not-found");
        });
    }, []);
    
    // Get the principal from the backend when an identity is available
    useEffect(() => {
        if (actor && identity) {
            // Check whether current user is page owner, so that we can display actions
            actor.isPageOwner(params.profileId)
            .then((isPageOwner) => {
                if (isPageOwner === true) {
                    setPageOwnership('owner');
                } else {
                    setPageOwnership('not-owner');
                }
            }).catch((error) => {
                setPageOwnership('not-owner');
            });
            // Get user principal if none set
            if (!principal) {
                actor.whoami().then((p) => {
                    setPrincipal(p)
                });
            }
        }
    }, [actor, identity, principal]);

    ////////////// DETAILS FORM START //////////////
    const [longEnough, setLongEnough] = useState(true);
    const [shortEnough, setShortEnough] = useState(true);
    const [alphanumeric, setAlphanumeric] = useState(true);
    const [validXLink, setValidXLink] = useState(true);
    const [validYoutubeLink, setValidYoutubeLink] = useState(true);
    const [submitDetailsDisabled, setSubmitDetailsDisabled] = useState(false);
    const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
    const [nameInForm, setNameInForm] = useState('');
    const [shortDescriptionInForm, setShortDescriptionInForm] = useState('');
    const [xAccountInForm, setXAccountInForm] = useState('');
    const [ytAccountInForm, setYtAccountInForm] = useState('');

    function handleNameChange(e) {
        let newName = e.target.value;
        setNameInForm(newName);
        if (isLongEnough(newName)) {
            setLongEnough(true);
            if (isShortEnough(newName)) {
                setShortEnough(true);
                if (isValidInput(newName)) {
                    setAlphanumeric(true);
                    setSubmitDetailsDisabled(false);
                } else {
                    setAlphanumeric(false);
                    setSubmitDetailsDisabled(true);
                }
            } else {
                setShortEnough(false);
                setSubmitDetailsDisabled(true);
            }
        } else {
            setLongEnough(false);
            setSubmitDetailsDisabled(true);
        }
    }

    function handleShortDescriptionChange(e) {
        setShortDescriptionInForm(e.target.value);
    }

    function handleXAccountChange(e) {
        let newXAccount = e.target.value;
        setXAccountInForm(newXAccount);
        if (isValidXLink(newXAccount)) {
            setValidXLink(true);
            setSubmitDetailsDisabled(false);
        } else {
            setValidXLink(false);
            setSubmitDetailsDisabled(true);
        }
    }

    function handleYtAccountChange(e) {
        let newYtAccount = e.target.value;
        setYtAccountInForm(newYtAccount);
        if (isValidYtLink(newYtAccount)) {
            setValidYoutubeLink(true);
            setSubmitDetailsDisabled(false);
        } else {
            setValidYoutubeLink(false);
            setSubmitDetailsDisabled(true);
        }
    }

    const isValidInput = str => /^[a-z0-9 ]*$/gi.test(str);
    const isLongEnough = str => str.length > 2;
    const isShortEnough = str => str.length < 30;
    const isValidXLink = link => {
        return link.includes('/x.com/') || link.includes('/twitter.com/') || link.includes('w.x.com/') || link.includes('w.twitter.com/');
    }
    const isValidYtLink = link => {
        return link.includes('/youtube.com/') || link.includes('/youtu.be/') || link.includes('w.youtube.com/') || link.includes('w.youtu.be/');
    }

    function handleDetailsSubmit(e) {
        e.preventDefault();
        setIsSubmittingDetails(true);
        let details = {
            name: nameInForm,
            shortDescription: shortDescriptionInForm,
            ytAccount: ytAccountInForm,
            xAccount: xAccountInForm
        }
        actor.updatePatron(details).then((message) => {
            if (message.length == 0) {
                setIsSubmittingDetails(false);
                toast({
                    title: 'Failed to update page details.',
                    description: "Looks like the patreon page you're trying to update doesn't exist anymore.",
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                });
            } else {
                setName(nameInForm);
                setShortDescription(shortDescriptionInForm);
                setYtAccount(ytAccountInForm);
                setXAccount(xAccountInForm);
                setIsSubmittingDetails(false);
                onDetailsClose();
                toast({
                    title: 'Details updated.',
                    description: "Your patreon page details were successfully updated.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            }
        }).catch((error) => {
            setIsSubmittingDetails(false);
            toast({
                title: 'Failed to update page details.',
                description: "An unknown error occured. Please try again later.",
                status: 'error',
                duration: 8000,
                isClosable: true,
            });
        });
        return false;
    }

    ////////////// DETAILS FORM END //////////////

    ////////////// DESCRIPTION FORM START //////////////

    const [fullDescriptionInForm, setFullDescriptionInForm] = useState('');
    const [submitDescriptionDisabled, setSubmitDescriptionDisabled] = useState(false);
    const [isSubmittingDescription, setIsSubmittingDescription] = useState(false);

    function handleFullDescriptionChange(e) {
        setFullDescriptionInForm(e.target.value);
    }

    function handleDescriptionSubmit(e) {
        e.preventDefault();
        setIsSubmittingDescription(true);
        actor.updateFullDescription(fullDescriptionInForm).then((message) => {
            if (message.length == 0) {
                setIsSubmittingDetails(false);
                toast({
                    title: 'Failed to update page description.',
                    description: "Looks like the patreon page you're trying to update doesn't exist anymore.",
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                });
            } else {
                setFullDescription(fullDescriptionInForm);
                setIsSubmittingDetails(false);
                onDescriptionClose();
                toast({
                    title: 'Description updated.',
                    description: "Your patreon page description was successfully updated.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            }
        }).catch((error) => {
            setIsSubmittingDetails(false);
            onDescriptionClose();
            toast({
                title: 'Failed to update page description.',
                description: "An unknown error occured. Please try again later.",
                status: 'error',
                duration: 8000,
                isClosable: true,
            });
        });
        return false;
    }

    ////////////// DESCRIPTION FORM END //////////////

    ////////////// DONATE START //////////////

    async function handleDonate(e) {

        /* if (actor) {
            actor.approve(1500000).then((result) => {
                console.log(result);
            })
        } */

        /* if (identity && principal) {
            const agent = await createAgent({
                identity,
                //host: HOST,
              });
              
            console.log(agent);
            console.log(process.env.CANISTER_ID_ICP_LEDGER); */
        if (actor) {

            const { metadata } = IcrcLedgerCanister.create({
                actor,
                canisterId: process.env.CANISTER_ID_ICP_LEDGER,
            });

            const accountIdentifier = AccountIdentifier.fromPrincipal({
                principal: Principal.fromText(principal),
                //subAccount: principalSubaccount
                //subAccount: null
            });
            console.log ("accountIdentifier");
            console.log (accountIdentifier);

            const data = await metadata({});
            console.log("data");
            console.log(data);

            /* let transferRequest = {
                to: accountIdentifier,
                amount: 100000
            };
            const block = await transfer(transferRequest);
            console.log(block); */

        } else {
            alert("Please log in first.")
        }
    }

    ////////////// DONATE END //////////////

    return (
        <Layout>
            <Box w={'100%'} h={'300px'} bgImg={'/defaultbgp.png'} bgSize={'cover'} bgPosition={'center center'} bgRepeat={'no-repeat'}></Box>
            <Grid templateColumns='repeat(9, 1fr)' pt={1}>
                <GridItem colSpan={3}>
                    { pageOwnership === 'owner' ? (
                        <>
                            <Button pl={4} pt={3} size='sm' variant='link' onClick={onDetailsOpen}>Edit details</Button>
                            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Edit details</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl>
                                        <FormLabel>Patreon name:</FormLabel>
                                        <Input placeholder='Enter your desired name' value={nameInForm} onChange={handleNameChange} isDisabled={isSubmittingDetails} required />
                                        {!longEnough ? (
                                            <FormHelperText>
                                                3 characters minimum.
                                            </FormHelperText>
                                        ) : (
                                            <></>
                                        )}
                                        {!shortEnough ? (
                                            <FormHelperText>
                                                30 characters maximum.
                                            </FormHelperText>
                                        ) : (
                                            <></>
                                        )}
                                        {!alphanumeric ? (
                                            <FormHelperText>
                                                Only alphanumerical characters and spaces are allowed.
                                            </FormHelperText>
                                        ) : (
                                            <></>
                                        )}
                                        <FormLabel pt={4}>Bio:</FormLabel>
                                        <Input placeholder='Your bio: a few words that describe you best.' value={shortDescriptionInForm} onChange={handleShortDescriptionChange} isDisabled={isSubmittingDetails} />
                                        <FormLabel pt={4}>X/Twitter:</FormLabel>
                                        <Input placeholder='A link to your X/Twitter page.' value={xAccountInForm} onChange={handleXAccountChange} isDisabled={isSubmittingDetails} />
                                        {!validXLink ? (
                                            <FormHelperText>
                                                Please enter a valid X/Twitter link.
                                            </FormHelperText>
                                        ) : (
                                            <></>
                                        )}
                                        <FormLabel pt={4}>Youtube:</FormLabel>
                                        <Input placeholder='A link to your Youtube page.' value={ytAccountInForm} onChange={handleYtAccountChange} isDisabled={isSubmittingDetails} />
                                        {!validYoutubeLink ? (
                                            <FormHelperText>
                                                Please enter a valid Youtube link.
                                            </FormHelperText>
                                        ) : (
                                            <></>
                                        )}
                                    </FormControl>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='gray' colorScheme='ghost' mr={3} onClick={onDetailsClose}>Close</Button>
                                    <Button isLoading={isSubmittingDetails} loadingText='Editting' variant='solid' colorScheme='blue' onClick={handleDetailsSubmit} isDisabled={submitDetailsDisabled}>Edit</Button>
                                </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </>
                     ) : <></>}
                </GridItem>
                <GridItem colSpan={3} pt={'70px'} >
                    <Box position={'absolute'} top={'270px'} left={'50%'} transform={'translate(-50%, 0)'}>
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src='/defaultpfp.png'
                            alt='Profile picture'
                        />
                    </Box>
                    <Grid templateRows='repeat(6, 1fr)' pt={1}>
                        <GridItem textAlign={'center'} colSpan={2} >
                            <StateHeading isVisible={dataLoaded} text={name} h='h4' size='md' />
                        </GridItem>
                        <GridItem fontSize='sm' textAlign={'center'} colSpan={2} >
                            <StateText isVisible={dataLoaded} text={shortDescription} skeletonCount={1} />
                        </GridItem>
                        <GridItem fontSize='sm' textAlign={'center'} colSpan={2} >
                            <Text>{dataLoaded ? followerCount : '...' } follower{followerCount > 0 ? 's' : '' } • {dataLoaded ? supporterCount : '...' } supporter{supporterCount > 0 ? 's' : '' }</Text>
                        </GridItem>
                        <GridItem colSpan={2} >
                            { pageOwnership === 'not-owner' ? (
                            <Center>
                                <Button onClick={handleDonate} colorScheme='blue'>Donate 1 ICP</Button>
                            </Center>     
                            ) : <></>}      
                        </GridItem>
                        <GridItem colSpan={2} >
                            <Center>
                                <HStack mt={4}>
                                    <IconContext.Provider value={{ size: '25px' }}>
                                        <Link to={xAccount} target='_blank'><FaXTwitter /></Link>
                                        <Link to={ytAccount} target='_blank'><FaYoutube /></Link>
                                    </IconContext.Provider>
                                </HStack>   
                            </Center>         
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem colSpan={3} />
            </Grid>
            <Tabs align='center' colorScheme='grey' >
                <TabList>
                    <Tab fontSize='sm' >About</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel fontSize='sm' >
                        <Grid templateColumns='repeat(9, 1fr)'>
                            <GridItem textAlign={'left'} colSpan={2}>
                                { pageOwnership === 'owner' ? (
                                <>
                                    <Button size='sm' variant='link' onClick={onDescriptionOpen}>Edit description</Button>
                                    <Modal isOpen={isDescriptionOpen} onClose={onDescriptionClose} size='xl'>
                                        <ModalOverlay />
                                        <ModalContent>
                                        <ModalHeader>Edit description</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <Textarea placeholder="This is the place where you can tell your followers all about yourself in great length." value={fullDescriptionInForm} onChange={handleFullDescriptionChange} isDisabled={isSubmittingDescription} />
                                        </ModalBody>
                                        <ModalFooter>
                                    <Button color='gray' colorScheme='ghost' mr={3} onClick={onDescriptionClose}>Close</Button>
                                    <Button isLoading={isSubmittingDescription} loadingText='Editting' variant='solid' colorScheme='blue' onClick={handleDescriptionSubmit} isDisabled={submitDescriptionDisabled}>Edit</Button>
                                        </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </>
                                ) : <></>}
                            </GridItem>
                            <GridItem textAlign={'justify'} colSpan={5} >
                                <StateText isVisible={dataLoaded} text={fullDescription} skeletonCount={5} />
                            </GridItem>
                            <GridItem colSpan={2} />
                        </Grid>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Layout>
    );
}
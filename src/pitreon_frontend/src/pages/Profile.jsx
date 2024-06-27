import { useEffect, useState } from 'react';
import { useLoaderData, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Switch, Tooltip, Button, Center, Grid, GridItem, HStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Image, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, FormControl, FormLabel, FormHelperText, useToast, Textarea, Card, CardBody, Stack, CardFooter, Heading, Divider, ButtonGroup } from '@chakra-ui/react'
import { useActor } from '../ic/Actors';
import Layout from '../components/Layout';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { IconContext } from "react-icons";
import { FaXTwitter, FaYoutube, FaRegHeart, FaHeart } from "react-icons/fa6";
import { pitreon_backend } from '../../../declarations/pitreon_backend';
import { StateText } from '../components/StateText';
import { StateHeading } from '../components/StateHeading';
import { createAgent } from "@dfinity/utils";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from '@dfinity/principal';

export function loader({ params }) {
    return { params };
}

export default function Profile() {
    const vaultPrincipal = "yuh6o-s7kdp-gmhsh-jqm7e-viaph-75452-ai426-rod4l-fjbyd-lcxzu-4qe";
    const { actor } = useActor();
    const { params } = useLoaderData();
    const { loginStatus, identity } = useInternetIdentity();
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
    let [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
    const { isOpen: isDescriptionOpen, onOpen: onDescriptionOpen, onClose: onDescriptionClose } = useDisclosure();

    // On page load, if a recent timestamp value of new is detected, display a success toaster
    useEffect(()=>{
        if (Date.now() - searchParams.get('new') <= 2000) {
            toast({
                title: 'Profile created.',
                description: "Your patreon page was successfully created.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
        }
    }, [])
  
    // Get profile page information
    useEffect(() => {
        pitreon_backend.getPatronInfo(params.profileId)
        .then((message) => {
            setName(message.ok[0].name);
            setShortDescription(message.ok[0].shortDescription);
            setFullDescription(message.ok[0].fullDescription);
            setXAccount(message.ok[0].xAccount);
            setYtAccount(message.ok[0].ytAccount);
            setFollowerCount(parseInt(message.ok[0].followerCount));
            setSupporterCount(parseInt(message.ok[0].supporterCount));
            setNameInForm(message.ok[0].name);
            setShortDescriptionInForm(message.ok[0].shortDescription);
            setFullDescriptionInForm(message.ok[0].fullDescription);
            setXAccountInForm(message.ok[0].xAccount);
            setYtAccountInForm(message.ok[0].ytAccount);
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
                console.log('error checking ownership !')
                console.log(error)
                setPageOwnership('not-owner');
            });
            // Get user principal if none set
            if (!principal) {
                setPrincipal(identity.getPrincipal().toText())
            }
        }
    }, [actor, identity, principal]);

    ////////////// DETAILS FORM //////////////

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
        return link == "" || link.includes('/x.com/') || link.includes('/twitter.com/') || link.includes('w.x.com/') || link.includes('w.twitter.com/');
    }
    const isValidYtLink = link => {
        return link == "" || link.includes('/youtube.com/') || link.includes('/youtu.be/') || link.includes('w.youtube.com/') || link.includes('w.youtu.be/');
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
            if (message.ok != null) {
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
            } else {
                setIsSubmittingDetails(false);
                toast({
                    title: 'Failed to update page details.',
                    description: message.err,
                    status: 'error',
                    duration: 7000,
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

    ////////////// DESCRIPTION FORM //////////////

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
            if (message.ok != null) {
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
            } else {
                setIsSubmittingDetails(false);
                toast({
                    title: 'Failed to update page description.',
                    description: message.err,
                    status: 'error',
                    duration: 7000,
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

    /////////////// FOLLOW //////////////
    const [isFollowingDisabled, setIsFollowingDisabled] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    // Get follower information
    useEffect(() => {
        if (identity && principal) {
            pitreon_backend.getFollowerInfo(principal, params.profileId)
            .then((message) => {
                setIsFollowing(message.ok.length > 0);
            }).catch((error) => {
                console.log('Error loading follow status.')
            });
        }
    }, [identity, principal]);

    async function handleFollow(e) {
        if (identity) {
            setIsFollowingDisabled(true)
            try {
                actor.toggleFollower(principal, params.profileId).then((message) => {
                    setIsFollowing(message['ok'])
                    setIsFollowingDisabled(false)
                    message['ok'] ? setFollowerCount(followerCount+1) : setFollowerCount(followerCount-1)
                })
            } catch(e) {
                setIsFollowingDisabled(false)
                console.log('Error retrieving follow status..')
            }
        } else {
            alert('Please log in first.')
        }
    }

    ////////////// SUPPORT //////////////
    const [tabIndex, setTabIndex] = useState(0)
    const [shrimpChecked, setShrimpChecked] = useState(false)
    const [octopusChecked, setOctopusChecked] = useState(false)
    const [dolphinChecked, setDolphinChecked] = useState(false)
    const [whaleChecked, setWhaleChecked] = useState(false)
    const [humpbackChecked, setHumpbackChecked] = useState(false)
    const [emoji, setEmoji] = useState('')
    const [switchDisabled, setSwitchDisabled] = useState(false)
    const shrimpAmount   =   50
    const octopusAmount  =  200
    const dolphinAmount  =  500
    const whaleAmount    = 1500
    const humpbackAmount = 5000

    // Get supporter information
    useEffect(() => {
        if (identity && principal) {
            pitreon_backend.getSupporterInfo(principal, params.profileId)
            .then((message) => {
                if (message.ok == undefined) {
                    throw new error()
                }
                if (message.ok.length > 0 && message.ok[0].active) {
                    switch(message.ok[0].monthlyCommitment) {
                        case shrimpAmount:
                            setShrimpChecked(true)
                            setEmoji('🦐')
                            break
                        case octopusAmount:
                            setOctopusChecked(true)
                            setEmoji('🐙')
                            break
                        case dolphinAmount:
                            setDolphinChecked(true)
                            setEmoji('🐬')
                            break
                        case whaleAmount:
                            setWhaleChecked(true)
                            setEmoji('🐳')
                            break
                        case humpbackAmount:
                            setHumpbackChecked(true)
                            setEmoji('🐋‍')
                            break
                    }
                }
            }).catch((error) => {
                console.log('Error loading supporter status.')
            });
        }
    }, [identity, principal]);

    async function handleSupport(e) {
        var amount = e.currentTarget.labels[0].dataset.amount;

        if (identity) {
            setShrimpChecked(false)
            setOctopusChecked(false)
            setDolphinChecked(false)
            setWhaleChecked(false)
            setHumpbackChecked(false)
            var isChecked = e.currentTarget.labels[0].dataset.checked == undefined || e.currentTarget.labels[0].dataset.checked != "";
            if (isChecked) {
                switch(Number(amount)) {
                    case shrimpAmount:
                        setShrimpChecked(true)
                        break
                    case octopusAmount:
                        setOctopusChecked(true)
                        break
                    case dolphinAmount:
                        setDolphinChecked(true)
                        break
                    case whaleAmount:
                        setWhaleChecked(true)
                        break
                    case humpbackAmount:
                        setHumpbackChecked(true)
                        break
                }
            }
            const agent = await createAgent({
                identity,
                fetchRootKey: process.env.FETCH_ROOT_KEY
            });

            const { approve } = IcrcLedgerCanister.create({
                agent,
                canisterId: process.env.CANISTER_ID_ICP_LEDGER,
            });

            let approveArgs = {
                spender: {
                    owner : Principal.fromText(process.env.CANISTER_ID_PITREON_LEDGER),
                    subaccount: []
                },
                amount: 1_000_000_000_000,
                //expected_allowance: 100,
                fee: 10_000
            }
            setSwitchDisabled(true)
                
            let promise = new Promise((resolve, reject) => {
                console.log('A')
                approve(approveArgs).then((message) => {
                    console.log('B')
                    console.log(message)
                    pitreon_backend.toggleSupporter(principal, params.profileId, Number(amount), isChecked).then((message) => {
                        console.log('C')
                        setSwitchDisabled(false)
                        if (isChecked) {
                            switch(Number(amount)) {
                                case shrimpAmount:
                                    setEmoji('🦐')
                                    break
                                case octopusAmount:
                                    setEmoji('🐙')
                                    break
                                case dolphinAmount:
                                    setEmoji('🐬')
                                    break
                                case whaleAmount:
                                    setEmoji('🐳')
                                    break
                                case humpbackAmount:
                                    setEmoji('🐋‍')
                                    break
                            }
                            setSupporterCount(supporterCount+1)
                        } else {
                            setSupporterCount(supporterCount-1)
                            setEmoji('')
                        }
                        resolve('Approval successful')
                    }).catch((error) => {
                        console.log('Error saving approval.')
                        console.log(error)
                        setSwitchDisabled(false)
                        reject(e)
                    });
                }).catch((error) => {
                    console.log('Error approving.')
                    console.log(error)
                    setSwitchDisabled(false)
                    reject(e)
                });
            })
            
            toast.promise(promise, {
                success: { title: isChecked ? 'Support started' : 'Support cancelled', description: isChecked ? 'You successfully pledged '+amount/100+' ICP per month.' : 'You successfully cancelled your pledge of '+amount/100+' ICP per month.', duration: 3000 },
                error: { title: 'An error occured', description: 'Something went wrong. Please try again later or contact the admin of this site.', duration: 5000 },
                loading: { title: isChecked ? 'Registering support' : 'Registering cancellation', description: 'Please wait while we process your request.' },
            })

        } else {
            alert("Please log in first.")
        }
    }

    const handleTabSwitch = (event) => {
        setTabIndex(1)
        setTimeout(() => {
            scroll({
                top: document.querySelector('#autoscrollHere').offsetTop,
                behavior: "smooth"
            })
          }, "100");
    }

    const handleTabsChange = (index) => {
        setTabIndex(index)
    }

    ////////////// DOM //////////////

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
                            <div id="autoscrollHere">
                                <StateHeading isVisible={dataLoaded} text={name} h='h4' size='md' />
                            </div>
                        </GridItem>
                        <GridItem fontSize='sm' textAlign={'center'} colSpan={2} >
                            <StateText isVisible={dataLoaded} text={shortDescription} skeletonCount={1} />
                        </GridItem>
                        <GridItem fontSize='sm' textAlign={'center'} colSpan={2} >
                            <Text>{dataLoaded ? followerCount : '...' } follower{followerCount > 1 ? 's' : '' } • {dataLoaded ? supporterCount : '...' } supporter{supporterCount > 1 ? 's' : '' }</Text>
                        </GridItem>
                        <GridItem colSpan={2} >
                            <Center>
                                <HStack mt={4}>
                                    <IconContext.Provider value={{ size: '25px' }}>
                                        { xAccount != "" ? <Link to={xAccount} target='_blank'><FaXTwitter /></Link> : <></> }
                                        { ytAccount != "" ? <Link to={ytAccount} target='_blank'><FaYoutube /></Link> : <></> }
                                    </IconContext.Provider>
                                </HStack>   
                            </Center>         
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem colSpan={3}>
                    { pageOwnership !== 'owner' ? (
                    <HStack position={'absolute'} right={'8px'} mt={1}>
                        { !identity ? (            
                            <>
                                <Tooltip label="Log in first" aria-label='A tooltip'>
                                    <Button variant="outline" colorScheme='gray' isDisabled={true}><FaRegHeart /></Button>
                                </Tooltip>
                                <Tooltip label="Log in first" aria-label='A tooltip'>
                                    <Button variant="outline" colorScheme='gray' isDisabled={true}>Support</Button>
                                </Tooltip>
                            </>
                          ) : (
                            <>
                                <Button onClick={handleFollow} isLoading={isFollowingDisabled} variant="outline" colorScheme='gray' isDisabled={isFollowingDisabled}>{ isFollowing ? <FaHeart /> : <FaRegHeart />}</Button>
                                <Button onClick={handleTabSwitch} variant={ emoji != '' ? 'solid' : 'outline'} colorScheme='gray'>
                                    { emoji != '' ? 'Supporting ('+emoji+')' : 'Support'}
                                </Button>
                            </>         
                          )
                        }
                    </HStack>
                    ) : <></> }
                </GridItem>
            </Grid>
            <Tabs index={tabIndex} onChange={handleTabsChange} align='center' colorScheme='grey' >
                <TabList>
                    <Tab fontSize='sm' >About</Tab>
                    { pageOwnership !== 'owner' ? (
                        <Tab fontSize='sm' >Support</Tab>
                    ) : <></> }
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
                    <TabPanel fontSize='sm' >
                        <Grid>
                            <GridItem textAlign={'justify'} >
                                <strong>Why support {name}?</strong> ICP is still in its infancy and we need to spread the word. 
                                Yes, its tech is superior, but that doesn't automatically bring adoption. Many out there - whether they be investors, devs or users - have yet to hear about ICP; that's why it's paramount to support strong communicators and advocates like <strong>{name}</strong>.
                                
                                <HStack mt={6}>
                                    <Card maxW='sm'>
                                        <CardBody>
                                            <Stack mt='6' spacing='3'>
                                                <Heading size='md'>🦐 Shrimp</Heading>
                                                <Text>
                                                    Show your support by pledging <strong>{shrimpAmount/100} ICP</strong> every month.
                                                </Text>
                                            </Stack>
                                        </CardBody>
                                        <CardFooter>
                                            <HStack>
                                                <Text color='blue.600' fontSize='2xl'>
                                                    {shrimpAmount/100} ICP / month
                                                </Text>
                                                <Switch isChecked={shrimpChecked} onChange={handleSupport} data-amount={shrimpAmount} size='lg' />
                                            </HStack>
                                        </CardFooter>
                                    </Card>
                                    <Card maxW='sm'> 
                                        <CardBody>
                                            <Stack mt='6' spacing='3'>
                                                <Heading size='md'>🐙 Octopus</Heading>
                                                <Text>
                                                    Show your support by pledging <strong>{octopusAmount/100} ICP</strong> every month.
                                                </Text>
                                            </Stack>
                                        </CardBody>
                                        <CardFooter>
                                            <HStack>
                                                <Text color='blue.600' fontSize='2xl'>
                                                    {octopusAmount/100} ICP / month
                                                </Text>
                                                <Switch isChecked={octopusChecked} onChange={handleSupport} data-amount={octopusAmount} size='lg' />
                                            </HStack>
                                        </CardFooter>
                                    </Card>
                                    <Card maxW='sm'>
                                        <CardBody>
                                            <Stack mt='6' spacing='3'>
                                                <Heading size='md'>🐬 Dolphin</Heading>
                                                <Text>
                                                    Show your support by pledging <strong>{dolphinAmount/100} ICP</strong> every month.
                                                </Text>
                                            </Stack>
                                        </CardBody>
                                        <CardFooter>
                                            <HStack>
                                                <Text color='blue.600' fontSize='2xl'>
                                                    {dolphinAmount/100} ICP / month
                                                </Text>
                                                <Switch isChecked={dolphinChecked} onChange={handleSupport} data-amount={dolphinAmount} size='lg' />
                                            </HStack>
                                        </CardFooter>
                                    </Card>
                                    <Card maxW='sm'>
                                        <CardBody>
                                            <Stack mt='6' spacing='3'>
                                                <Heading size='md'>🐳 Whale</Heading>
                                                <Text>
                                                    Show your support by pledging <strong>{whaleAmount/100} ICP</strong> every month.
                                                </Text>
                                            </Stack>
                                        </CardBody>
                                        <CardFooter>
                                            <HStack>
                                                <Text color='blue.600' fontSize='2xl'>
                                                    {whaleAmount/100} ICP / month
                                                </Text>
                                                <Switch isChecked={whaleChecked} onChange={handleSupport} data-amount={whaleAmount} size='lg' />
                                            </HStack>
                                        </CardFooter>
                                    </Card>
                                    <Card maxW='sm'>
                                        <CardBody>
                                            <Stack mt='6' spacing='3'>
                                                <Heading size='md'>🐋‍ Humpback</Heading>
                                                <Text>
                                                    Show your support by pledging <strong>{humpbackAmount/100} ICP</strong> every month.
                                                </Text>
                                            </Stack>
                                        </CardBody>
                                        <CardFooter>
                                            <HStack>
                                                <Text color='blue.600' fontSize='2xl'>
                                                    {humpbackAmount/100} ICP / month
                                                </Text>
                                                <Switch isChecked={humpbackChecked} onChange={handleSupport} data-amount={humpbackAmount} size='lg' />
                                            </HStack>
                                        </CardFooter>
                                    </Card>

                                </HStack>
                                
                            </GridItem>
                            <GridItem colSpan={2} />
                        </Grid>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Layout>
    );
}
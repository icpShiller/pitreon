import { useEffect, useState } from 'react';
import { useLoaderData, redirectDocument, Link } from 'react-router-dom';
import { Button, Spinner, Center, Heading, Grid, GridItem, HStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Image, Box, LinkBox } from '@chakra-ui/react'
import { useActor } from '../ic/Actors';
import Layout from '../components/Layout';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { IconContext } from "react-icons";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { pitreon_backend } from '../../../declarations/pitreon_backend';
import { StateText } from '../components/StateText';
import { StateHeading } from '../components/StateHeading';

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
    const [ownershipState, setOwnershipState] = useState('isNotPageOwner');
  
    // Clear the principal when the identity is cleared
    useEffect(() => {
      if (!identity) setPrincipal(undefined);
    }, [identity]);
  
    // Get the principal from the backend when an identity is available
    useEffect(() => {
        pitreon_backend.getPatronInfo(params.profileId)
        .then((content) => {
            console.log(content);
            if (content.length === 0) {
                console.log('Starting redirection..');
                return redirectDocument("/not-found");
            }
            setName(content[0].name);
            setShortDescription(content[0].shortDescription);
            setFullDescription(content[0].fullDescription);
            setXAccount(content[0].xAccount);
            setYtAccount(content[0].ytAccount);
            setFollowerCount(parseInt(content[0].followerCount));
            setSupporterCount(parseInt(content[0].supporterCount));
            setDataLoaded(true);
        }).catch((error) => {
            console.log('Error loading the page.');
            return redirect("/not-found");
        });
        if (actor && identity) {
            // Check whether current user is page owner, so that we can display actions
            actor.isPageOwner(params.profileId)
            .then((isPageOwner) => {
                if (isPageOwner === true) {       
                    setOwnershipState('isPageOwner');
                } else {
                    setOwnershipState('isNotPageOwner');
                }
            }).catch((error) => {
                setOwnershipState('isNotPageOwner');
            });
            // Get user principal if none set
            if (!principal) {
                actor.whoami().then((p) => {
                    setPrincipal(p)
                });
            }
        }
    }, [actor, identity, principal]);

    function handleClick(e) {
        const { actor } = useActor();     
        e.preventDefault();
        actor.addPatron(name).then((message) => {
            alert(message);
        });
        return false;
    }

    function handleChange(e) {
        setName(e.target.value); 
    }

    return (
        <Layout>
            <Box w={'100%'} h={'300px'} bgImg={'/defaultbgp.png'} bgSize={'cover'} bgPosition={'center center'} bgRepeat={'no-repeat'}></Box>
            <Grid templateColumns='repeat(9, 1fr)' pt={1}>
                <GridItem colSpan={3} />
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
                            <Center>
                                <Button colorScheme='blue'>Login</Button>
                            </Center>               
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
                        <Grid templateColumns='repeat(9, 1fr)' pt={1}>
                            <GridItem colSpan={2} />
                            <GridItem colSpan={5} >
                                <StateText isVisible={dataLoaded} text={fullDescription} skeletonCount={5} />
                            </GridItem>
                            <GridItem colSpan={2} />
                        </Grid>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            {/* <Input placeholder='Enter your desired name' value={name} onChange={handleChange} />
            <Button colorScheme='purple' onClick={handleClick}>Create my profile</Button> */}
        </Layout>
    );
}
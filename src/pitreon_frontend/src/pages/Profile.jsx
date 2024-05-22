import { useEffect, useState } from 'react';
import { Link, useLoaderData, redirect } from 'react-router-dom';
import { Input, Button, Spinner, Center, Heading, Wrap, WrapItem, Spacer, Grid, GridItem, HStack, Text, Divider, Tabs, TabList, TabPanels, TabPanel, Tab, Image, Box } from '@chakra-ui/react'
import { useActor } from '../ic/Actors';
import Layout from '../components/Layout';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { IconContext } from "react-icons";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";

export function loader({ params }) {
    return { params };
}

export default function Profile() {
    const { actor } = useActor();
    const { params } = useLoaderData();
    const { identity } = useInternetIdentity();
    const [principal, setPrincipal] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [xAccount, setXAccount] = useState('');
    const [ytAccount, setYtAccount] = useState('');
    const [pageState, setPageState] = useState('dataLoaded');
  
    // Clear the principal when the identity is cleared
    useEffect(() => {
      if (!identity) setPrincipal(undefined);
    }, [identity]);
  
    // Get the principal from the backend when an identity is available
    useEffect(() => {
        if (actor) {
            // Get page info
            console.log('actor?');
            actor.getPatronInfo(params.profileId)
            .then((content) => {
                console.log('content: ');
                console.log(content);
                if (content === null) {
                    console.log('Error loading the page.');
                    return redirect("/not-found");
                }
                setName(content.name);
                setDescription(content.description);
                setXAccount(content.xAccount);
                setYtAccount(content.ytAccount);
                setPageState('dataLoaded');
            }).catch((error) => {
                console.log('Error loading the page.');
                return redirect("/not-found");
            });
            if (identity) {
                // Check whether current user is page owner, so that we can display actions
                actor.isPageOwner(params.profileId)
                .then((isPageOwner) => {
                    if (isPageOwner === true) {       
                        setPageState('isPageOwner');
                    } else {
                        setPageState('isNotPageOwner');
                    }
                }).catch((error) => {
                    setPageState('isNotPageOwner');
                });
                // Get user principal if none set
                if (!principal) {
                    actor.whoami().then((p) => {
                        setPrincipal(p)
                    });
                }
            }
        } else { console.log('actor not generated yet :('); }
        
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

    switch(pageState) {
        case 'loading':
            return (
                <Layout>
                    <Center minH='600px'>
                        <Spinner size='xl' />
                    </Center>
                </Layout>
            );

        case 'dataLoaded':
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
                                    <Heading as='h4' size='md'>           
                                        ICP Whale News
                                    </Heading>
                                </GridItem>
                                <GridItem fontSize='sm' textAlign={'center'} colSpan={2} >
                                    <Center>
                                        <Text>Some short description about me and my activities</Text>
                                    </Center>
                                </GridItem>
                                <GridItem fontSize='sm' textAlign={'center'} colSpan={2} >
                                    <Text>153 followers • 17 supporters</Text>
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
                                                <FaXTwitter /> 
                                                <FaYoutube />
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
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
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
}
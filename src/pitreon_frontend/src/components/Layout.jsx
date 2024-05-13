import { Heading, Grid, GridItem, Wrap, WrapItem, Spacer, Container } from '@chakra-ui/react'
import { LoginButton } from '../components/LoginButton';
import { useActor } from '../ic/Actors';
import { Link } from 'react-router-dom';

export default function Layout({children}) {
    const { actor } = useActor();

    return (
        <>
            <Container maxW={'2000px'} padding='2'>
                <Grid templateColumns='repeat(10, 1fr)'>
                    <GridItem colSpan={1} bg='blue.500' />
                    <GridItem colSpan={8} bg='green.500'>
                        <Wrap gap={6}>
                            <WrapItem>
                                <Heading>
                                    <Link to="/">ICPatreon</Link>
                                </Heading>
                            </WrapItem>
                            <Spacer />
                            <WrapItem>
                                <LoginButton />
                            </WrapItem>
                        </Wrap>                    
                        {children}

                    </GridItem>
                    <GridItem colSpan={1} bg='red.500' />
                </Grid>
            </Container>
        </>
    );
}
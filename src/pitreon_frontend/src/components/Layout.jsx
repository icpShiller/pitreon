import { Wrap, WrapItem, Spacer, Container, Image } from '@chakra-ui/react'
import { LoginButton } from './LoginButton';
import { Link } from 'react-router-dom';

export default function Layout({children}) {

    return (
        <>
            <Container maxW={'2000px'} padding={0}>
                <Wrap p={2}>
                    <WrapItem>
                        <Link to="/"><Image src="/logo.svg" boxSize='38px' /></Link>
                    </WrapItem>
                    <Spacer />
                    <WrapItem>
                        <LoginButton />
                    </WrapItem>
                </Wrap>                    
                {children}
            </Container>
        </>
    );
}
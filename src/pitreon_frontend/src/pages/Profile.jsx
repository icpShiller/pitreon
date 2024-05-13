import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heading, Input, Button } from '@chakra-ui/react'
import { LoginButton } from '../components/LoginButton';
import { useActor } from '../ic/Actors';

export default function Profile() {
    const [name, setName] = useState('');
    const { actor } = useActor();

    function handleClick(e) {
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
        <>
            <Heading>Profile page</Heading>
            <LoginButton />
            <br />
            <br />
            <Input placeholder='Enter your desired name' value={name} onChange={handleChange} />
            <Button colorScheme='purple' onClick={handleClick}>Create my profile</Button>
            <br />
            <Link to="/"><button className='primary'>link to home page</button></Link>
        </>
    );
}
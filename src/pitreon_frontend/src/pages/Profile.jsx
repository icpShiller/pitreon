import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '@chakra-ui/react'
import { LoginButton } from '../components/LoginButton';
import { useActor } from '../ic/Actors';
import Layout from '../components/Layout';

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
        <Layout>
            <Input placeholder='Enter your desired name' value={name} onChange={handleChange} />
            <Button colorScheme='purple' onClick={handleClick}>Create my profile</Button>
            <br />
            <br />
            <Link to="/"><button className='primary'>link to home page</button></Link>
        </Layout>
    );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { LoginButton } from '../components/LoginButton';
import { useActor } from '../ic/Actors';

export default function Home() {

    const [greeting, setGreeting] = useState('');
    const { actor } = useActor();

    function handleSubmit(event) {
        event.preventDefault();
        //const name = event.target.elements.name.value;
        actor.greet().then((greeting) => {
            setGreeting(greeting);
        });
        return false;
    }

    return (
        <>
            <Heading>Home page</Heading>
            <LoginButton />
            <br /> 
            <form action="#" onSubmit={handleSubmit}>
                <label htmlFor="name">Enter your name: &nbsp;</label>
                <input id="name" alt="Name" type="text" />
                <button className="primary" type="submit">Click Me!</button>
            </form>
            <section id="greeting">{greeting}</section>
            <Link to="/profile/123"><button className='primary'>link to profile</button></Link>
        </>
    );
}
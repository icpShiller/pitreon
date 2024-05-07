import { useState } from 'react';
import { createActor, pitreon_backend } from 'declarations/pitreon_backend';
import {AuthClient} from "@dfinity/auth-client";
import {HttpAgent} from "@dfinity/agent";
import { Link } from 'react-router-dom';

export default function Home() {

    const [greeting, setGreeting] = useState('');
    let actor = pitreon_backend;

    function handleSubmit(event) {
        event.preventDefault();
        //const name = event.target.elements.name.value;
        actor.greet().then((greeting) => {
            setGreeting(greeting);
        });
        return false;
    }

    async function login(event) {
        event.preventDefault();

        let authClient = await AuthClient.create();
        let internetProvider = process.env.DFX_NETWORK == 'local' ? 'http://' + process.env.CANISTER_ID_INTERNET_IDENTITY + '.localhost:4943' : 'https://identity.ic0.app/';

        await new Promise((resolve) => {
            authClient.login({
                identityProvider: internetProvider,
                onSuccess: resolve,
            });
        });

        const identity = authClient.getIdentity();
        const agent = new HttpAgent({identity});
        actor = createActor(process.env.CANISTER_ID_PITREON_BACKEND, {
            agent,
        });

        return false;
    }

    return (
        <>
        <img src="/logo2.svg" alt="DFINITY logo" />
            <br />
        <br />
        <form action="#" onSubmit={login}>
            <button className="success" id="login">Login!</button>
        </form>
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
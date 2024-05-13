import { InternetIdentityProvider } from "ic-use-internet-identity";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import { ChakraProvider } from '@chakra-ui/react';
import Actors from './ic/Actors';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/profile/:profileId",
        element: <Profile />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider>
        <React.StrictMode>
            <InternetIdentityProvider>
                <Actors>
                    <RouterProvider router={router} />
                </Actors>
            </InternetIdentityProvider>
        </React.StrictMode>
    </ChakraProvider>
    
);

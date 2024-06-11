import { InternetIdentityProvider } from "ic-use-internet-identity";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Profile, {
    loader as profileLoader,
  } from './pages/Profile';
import { ChakraProvider } from '@chakra-ui/react';
import Actors from './ic/Actors';
import ErrorPage from "./pages/ErrorPage";
import CreatePatreon from "./pages/CreatePatreon";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/not-found",
        element: <NotFound />,
    },
    {
        path: "/profile/:profileId",
        element: <Profile />,
        loader: profileLoader,
    },
    {
        path: "/create-patreon",
        element: <CreatePatreon />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <InternetIdentityProvider>
            <Actors>
                <ChakraProvider>
                    <RouterProvider router={router} />
                </ChakraProvider>
            </Actors>
        </InternetIdentityProvider>
    </React.StrictMode>
    
);

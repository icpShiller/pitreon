import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import "../../../node_modules/@dfinity/gix-components/dist/styles/global.scss";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
      path: "profile/:profileId",
      element: <Profile />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

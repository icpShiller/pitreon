import { useRouteError } from "react-router-dom";
import Layout from "../components/Layout";
import { Center, Heading, Text } from "@chakra-ui/react";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <Layout>
            <Center>
                <Heading>Oops!</Heading>
            </Center>
            <Center>
                Sorry, an unexpected error has occurred.
            </Center>
            <Center fontStyle={'italic'}>
                {error.statusText || error.message}
            </Center>
        </Layout>
    );
}
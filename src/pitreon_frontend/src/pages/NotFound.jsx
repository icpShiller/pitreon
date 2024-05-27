import Layout from "../components/Layout";
import { Center, Heading } from "@chakra-ui/react";

export default function NotFound() {

    return (
        <Layout>
            <Center>
                <Heading>Oops!</Heading>
            </Center>
            <Center>
                Looks like the profile page you're looking for does not exist.
            </Center>
        </Layout>
    );
}
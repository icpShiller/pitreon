import { Heading, Skeleton, Stack } from "@chakra-ui/react";

export function StateHeading({isVisible, text, h, size}) {
    if (isVisible) {
        return (
            <Heading as={h} size={size}>{text}</Heading>      
        )
    } else {
        return (
            <Stack>
                <Skeleton height='20px' />
            </Stack>
        )
    }
}
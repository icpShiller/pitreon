import { Skeleton, Stack, Text } from "@chakra-ui/react";

export function StateText({isVisible, text, skeletonCount = 1}) {
    if (isVisible) {
        return (
            <Text>{text}</Text>       
        )
    } else {
        const rows = [];
        for (let i = 0; i < skeletonCount; i++) {
            rows.push(<Skeleton key={i} height='20px' />);
        }
        return (
            <Stack>
                {rows}
            </Stack>
        )
    }
}
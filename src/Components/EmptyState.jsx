import { 
    Box,
    Text,
    Image,
} from '@chakra-ui/react';

export const EmptySearchState = () => {
    return (
        <Box>
            <Image aspectRatio="32/9" src="/emptyState.svg" alt="No restaurant found"/>
            <Text fontSize="18px" padding={"0 2rem 2rem 2rem"}>
                Uh oh! Seems like there is no restaurant that suit the search criteria. 
                Try <span style={{ fontWeight: 600 }}>searching other keyword</span>
            </Text>
        </Box>
    )
}
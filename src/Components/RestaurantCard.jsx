import { Box, VStack, Text, Image } from '@chakra-ui/react';

export const RestaurantCard = ({ restaurant, onOpen }) => {
    const { description, title, thumbnail } = restaurant

    return (
        <Box 
            maxW="sm" 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="md"
            onClick={onOpen} 
            width="273px"
        >
            <Image 
                src={thumbnail} 
                alt="Restaurant thumbnail" 
                width="100%"
                height="200px"
                fit="cover"
            />
            <VStack align="stretch" p={2} fontFamily={"'proxima-nova', 'Helvetica Neue', arial, sans-serif"}>
                <Text fontSize="18px" fontWeight="bold">{ title }</Text>
                <Text noOfLines="3" color="#333333" fontWeight="400">{ description }</Text>
            </VStack>
        </Box>
    );
}
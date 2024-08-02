import { Box, VStack, Text, Image, Heading } from '@chakra-ui/react';

export const RestaurantCard = ({ restaurant }) => {
    const { description, location, region, title, thumbnail } = restaurant
    return (
        <Box 
            maxW="sm" 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="md"
            width="182px"
        >
            <Image 
                src={thumbnail} 
                alt="Restaurant thumbnail" 
                width="100%"
            />
            <VStack align="stretch" p={4} spacing={2}>
                <Heading size="md">{ title }</Heading>
                <Text fontWeight="bold">770 Reviews</Text>
                <Text color="gray.500">North Bridge Road</Text>
                <Text color="gray.500">Cafes & Coffees</Text>
            </VStack>
        </Box>
    );
}
import { Box, VStack, Text, Image, HStack } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export const RestaurantCard = ({ restaurant, onOpen }) => {
    const { region, title, thumbnail } = restaurant
    return (
        <Box 
            maxW="sm" 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="md"
            onClick={onOpen} 
            width="182px"
        >
            <Image 
                src={thumbnail} 
                alt="Restaurant thumbnail" 
                width="100%"
                height="200px"
                fit="cover"
            />
            <VStack align="stretch" p={2}>
                <Text fontWeight="bold">{ title }</Text>
                <HStack>
                    <FontAwesomeIcon icon={faMapMarkerAlt} color="#718096" />
                    <Text isTruncated color="gray.500">{ region }</Text>
                </HStack>
            </VStack>
        </Box>
    );
}
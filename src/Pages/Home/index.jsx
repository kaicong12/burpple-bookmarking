import { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Input,
  Select,
  Text,
  Flex,
  Container,
  Heading,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'

import { CreateBookmark } from './CreateBookmark'
import { RestaurantCard } from "../../Components/RestaurantCard";
import { useBookmarkList } from './useBookmarkList';


export const Home = () => {
    const { 
        regionLists,
        newRestaurant,
        setNewRestaurant,
        restaurantList, 
        handleAddRestaurant, 
        handleCardClick, 
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose
    } = useBookmarkList()

    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleLocationFilter = (event) => {
        setLocationFilter(event.target.value);
    };

    const filteredBookmarks = restaurantList.filter(bookmark => 
        (bookmark?.title?.toLowerCase().includes(searchTerm) || 
        bookmark?.description?.toLowerCase().includes(searchTerm)) &&
        (locationFilter === '' || bookmark?.region === locationFilter)
    );
  
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Heading>My Bookmarked Restaurants</Heading>
                
                <HStack spacing={4}>
                    <Input
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Select
                        placeholder="Filter by location"
                        value={locationFilter}
                        onChange={handleLocationFilter}
                    >
                        <option value="Central, Singapore">Central, Singapore</option>
                        <option value="North, Singapore">North, Singapore</option>
                        <option value="East, Singapore">East, Singapore</option>
                        <option value="West, Singapore">West, Singapore</option>
                        <option value="NorthEast, Singapore">NorthEast, Singapore</option>
                    </Select>
                    <Button 
                        onClick={onAddModalOpen} 
                        bg="brown.200" 
                        minWidth="80px"
                    >
                        <AddIcon mr="6px" />
                        Add
                    </Button>
                </HStack>

                {filteredBookmarks.length === 0 ? (
                    <Text>No bookmarks found matching your criteria.</Text>
                ) : (
                    <Flex>
                        {filteredBookmarks.map(restaurant => (
                            <Box key={restaurant.id}>
                                <RestaurantCard restaurant={restaurant} />
                            </Box>
                        ))}
                    </Flex>
                )}
            </VStack>
            <CreateBookmark 
                newRestaurant={newRestaurant}
                setNewRestaurant={setNewRestaurant}
                isAddModalOpen={isAddModalOpen}
                onAddModalClose={onAddModalClose}
                handleAddRestaurant={handleAddRestaurant}
                regionLists={regionLists}
            />
        </Container>
    );
};

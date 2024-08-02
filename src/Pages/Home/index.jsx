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
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  MenuDivider
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'

import { CreateBookmark } from './CreateBookmark'
import { RestaurantCard } from "../../Components/RestaurantCard";
import { useBookmarkList } from './useBookmarkList';


export const Home = () => {
    const { 
        searchValue,
        sortByValue,
        setSortByValue,
        regionFilters,
        onRegionFilterChange,
        regionLists,
        newRestaurant,
        setNewRestaurant,
        restaurantList, 
        handleAddRestaurant, 
        handleCardClick, 
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        onSearchInputChange
    } = useBookmarkList()
  
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Heading>My Bookmarked Restaurants</Heading>
                
                <HStack spacing={4}>
                    <Input
                        placeholder="Search restaurants..."
                        value={searchValue}
                        onChange={onSearchInputChange}
                    />
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button} colorScheme='blue'>
                            MenuItem
                        </MenuButton>
                        <MenuList minWidth='240px'>
                            <MenuOptionGroup onChange={onRegionFilterChange} title='Region' type='checkbox'>
                                { regionLists.map(region => <MenuItemOption key={`region-${region}`} value={region}>{ region }</MenuItemOption>) }
                            </MenuOptionGroup>
                        </MenuList>
                    </Menu>
                    <Button 
                        onClick={onAddModalOpen} 
                        bg="brown.200" 
                        minWidth="80px"
                    >
                        <AddIcon mr="6px" />
                        Add
                    </Button>
                </HStack>

                {restaurantList.length === 0 ? (
                    <Text>No bookmarks found matching your criteria.</Text>
                ) : (
                    <Flex>
                        {restaurantList.map(restaurant => (
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

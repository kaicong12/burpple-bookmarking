import { useState, useEffect, forwardRef, useCallback } from 'react'
import {
    Box,
    Button,
    VStack,
    HStack,
    Input,
    Text,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
    Spinner,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas, faSort, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { EmptySearchState } from '../../Components/EmptyState';
import { CreateBookmark } from './CreateBookmark'
import { RestaurantCard } from "../../Components/RestaurantCard";
import { useBookmarkList } from './useBookmarkList';
import { useRestaurant } from '../../context/RestaurantContext';


const FilterButton = forwardRef((props, ref) => {
    const { rightIcon, buttontext } = props
    return (
        <Button {...props} rightIcon={rightIcon} ref={ref}>
            { buttontext }
        </Button>
    )
})

export const Home = () => {
    const { 
        sortByValue,
        regionFilters,
        onRegionFilterChange,
        regionLists,
        folderList,
        isLoadingRestaurants,
        restaurantList,
        sortOptions,
        onSearchInputChange,
        setSortByValue,
    } = useBookmarkList()

    const { 
        handleCardClick,
        isModalLoading,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        handleAddRestaurant,
    } = useRestaurant()

    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearchInputChange(searchTerm)
        }, 500)

        return () => clearTimeout(timeout)
    }, [onSearchInputChange, searchTerm])

    const renderRestaurantList = useCallback((restaurants) => {
        if (!restaurants.length) {
            return <EmptySearchState />
        }

        return (
            <Flex gap="20px" mt="20px">
                {restaurants.map(restaurant => (
                    <Box key={restaurant.id}>
                        <RestaurantCard onOpen={() => handleCardClick(restaurant)} restaurant={restaurant} />
                    </Box>
                ))}
            </Flex>
        )
    }, [handleCardClick])
  
    return (
        <Box w="100vw">
            <VStack align="stretch">
                <Flex bg="#f7f4f2" py="10px" justifyContent="center">
                    <InputGroup width="80%">
                        <InputLeftElement top="6px" pointerEvents='none'>
                            <FontAwesomeIcon color="#8e8e8e" icon={faMagnifyingGlass} />
                        </InputLeftElement>
                        <Input
                            height="50px"
                            boxShadow="0 2px 3px 0 rgba(0, 0, 0, 0.15);"
                            borderRadius="5px"
                            bg="white"
                            placeholder="E.g. western at Telok Ayer"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Flex>

                <Box px="30px">
                    <Flex justifyContent="space-between" my="10px">
                        <HStack>
                            <Menu>
                                <MenuButton
                                    as={FilterButton}
                                    buttontext={'Sort By'}
                                    bg="#ea246e" 
                                    color="white"
                                    leftIcon={<FontAwesomeIcon icon={faSort} />}
                                >
                                </MenuButton>
                                <MenuList>
                                    <MenuOptionGroup defaultValue={sortByValue} onChange={(value) => { setSortByValue(value) }}>
                                        {sortOptions.map(sortOpt => (
                                            <MenuItemOption 
                                                key={sortOpt} 
                                                value={sortOpt}
                                            >
                                                <Box display="flex" gap="10px" alignItems="center">
                                                    <Text>{ sortOpt }</Text>
                                                </Box>
                                            </MenuItemOption>
                                        ))}
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                            
                            <Menu closeOnSelect={false}>
                                <MenuButton
                                    as={FilterButton}
                                    buttontext={`Region ${regionFilters.length ? ` (${regionFilters.length})`: ''}`}
                                    bg="#ea246e" 
                                    color="white"
                                    leftIcon={<FontAwesomeIcon icon={faEarthAmericas} />}
                                >
                                    MenuItem
                                </MenuButton>
                                <MenuList minWidth='240px'>
                                    <MenuOptionGroup value={regionFilters} onChange={onRegionFilterChange} title='Region' type='checkbox'>
                                        { regionLists.map(region => <MenuItemOption key={`region-${region}`} value={region}>{ region }</MenuItemOption>) }
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                        </HStack>

                        <Button 
                            onClick={onAddModalOpen} 
                            bg="#ea246e" 
                            minWidth="80px"
                            color="white"
                        >
                            <AddIcon mr="6px" />
                            New Bookmark
                        </Button>
                    </Flex>
                    
                    {isLoadingRestaurants ? (
                        <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
                            <Spinner position="relative" top="-100px" size="xl" />
                        </Box>
                    ) : (
                        renderRestaurantList(restaurantList)
                    )}
                </Box>
                
            </VStack>
            <CreateBookmark 
                isLoading={isModalLoading}
                isAddModalOpen={isAddModalOpen}
                onAddModalClose={onAddModalClose}
                handleAddRestaurant={handleAddRestaurant}
                regionLists={regionLists}
                folderList={folderList}
            />
        </Box>
    );
};

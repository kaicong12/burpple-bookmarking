import { Box, Button, Text, Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'

import { RestaurantCard } from '../../Components/RestaurantCard';
import { CreateFolderModal } from './CreateFolder';
import { useRestaurant } from '../../context/RestaurantContext';
import { useFolderList } from "./useFolderList"


export const FolderPage = () => {
    const {
        folders,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        newFolder, 
        setNewFolder,
        handleAddFolder
    } = useFolderList()

    const {
        handleCardClick 
    } = useRestaurant()

    return (
        <Box padding="30px">
            <Flex justifyContent="flex-end">
                <Button 
                    onClick={onAddModalOpen} 
                    bg="#ea246e" 
                    minWidth="80px"
                    color="white"
                >
                    <AddIcon mr="6px" />
                    New Folder
                </Button>
            </Flex>
            {folders.map((folder) => (
                <Box key={folder.id} mb={8}>
                    <Text fontSize="xl" fontWeight="bold">{folder.name}</Text>
                    <Text fontSize="sm" color="gray.500">{folder.description}</Text>
                    { folder.restaurants?.length ? (
                        <Flex gap={4} mt="20px">
                            {folder.restaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} onOpen={() => handleCardClick(restaurant)} restaurant={restaurant} />
                            ))}
                        </Flex>
                    ) : (
                        <Box minH="100px" display="flex" justifyContent="center" alignItems="center">
                            There is no restaurant under this folder yet.
                        </Box>
                    )}
                </Box>
            ))}

            <CreateFolderModal
                newFolder={newFolder}
                setNewFolder={setNewFolder}
                isAddModalOpen={isAddModalOpen}
                onAddModalClose={onAddModalClose}
                handleAddFolder={handleAddFolder}
            />
        </Box>
    )
}
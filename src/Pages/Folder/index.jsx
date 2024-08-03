import { Box, Button, Text, Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'

import { RestaurantCard } from '../../Components/RestaurantCard';
import { CreateFolderModal } from './CreateFolder';
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
                    <Flex flexWrap="wrap" gap={4}>
                        {folder.restaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </Flex>
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
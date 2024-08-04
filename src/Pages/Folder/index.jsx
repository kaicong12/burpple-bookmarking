    import { 
    Box, 
    Button, 
    Text, 
    Flex, 
    IconButton, 
    Menu, 
    MenuButton, 
    MenuList, 
    MenuItem,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { RestaurantCard } from '../../Components/RestaurantCard';
import { CreateFolderModal } from './CreateFolder';
import { useRestaurant } from '../../context/RestaurantContext';
import { useFolderList } from "./useFolderList"
import { FolderDeleteModal } from './FolderDeleteModal'


export const FolderPage = () => {
    const {
        folders,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        newFolder, 
        setNewFolder,
        handleAddFolder,
        onClickEditFolder,
        handleEditFolder,
        onClickDeleteFolder,
        handleDeleteFolder,
        isEditModalOpen,
        onEditModalClose,
        isDeleteModalOpen,
        onDeleteModalClose,
        folderToBeDeleted,
        isDeleting
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
                    <Flex justifyContent="space-between" alignItems="center">
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">{folder.name}</Text>
                            <Text fontSize="sm" color="gray.500">{folder.description}</Text>
                        </Box>
                        <Menu>
                            <MenuButton as={IconButton} icon={<FontAwesomeIcon icon={faEllipsis} />} variant="outline" />
                            <MenuList>
                                <MenuItem icon={<FontAwesomeIcon icon={faPenToSquare} />} onClick={() => onClickEditFolder(folder)}>
                                    Edit
                                </MenuItem>
                                <MenuItem icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => onClickDeleteFolder(folder)}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    { folder.restaurants?.length ? (
                        <Flex gap={4} mt="20px" overflowX="auto">
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
                isAddModalOpen={isAddModalOpen || isEditModalOpen}
                onAddModalClose={() => {
                    onAddModalClose();
                    onEditModalClose();
                    setNewFolder(null)
                }}
                handleAddFolder={handleAddFolder}
                handleEditFolder={handleEditFolder}
                isEdit={isEditModalOpen}
            />

            { isDeleteModalOpen ? (
                <FolderDeleteModal 
                    isDeleting={isDeleting}
                    folder={folderToBeDeleted}
                    isOpen={isDeleteModalOpen}
                    onClose={onDeleteModalClose}
                    handleConfirmDelete={handleDeleteFolder}
                />
            ) : null }
        </Box>
    )
}
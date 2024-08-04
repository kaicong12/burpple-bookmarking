import {
    Modal,
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalBody,
    Text,
    Box,
    Divider,
    UnorderedList,
    ListItem
} from '@chakra-ui/react';


export const FolderDeleteModal = ({ isDeleting, folder, isOpen, onClose, handleConfirmDelete }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader py="10px">Delete Folder</ModalHeader>
                <Divider />
                <ModalCloseButton />
                <ModalBody>
                    <Text>Are you sure you want to delete this folder? This action cannot be undone.</Text>
                    { folder.restaurants?.length ? (
                        <Box>
                            <Text mt={4}>The following restaurants will lose this folder:</Text>
                            <Box>
                                <UnorderedList>
                                    {folder.restaurants.map(restaurant => (
                                        <ListItem key={restaurant.id}>
                                            {restaurant.title}
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        </Box>
                    ) : null }
                </ModalBody>
                <Divider />
                <ModalFooter py="12px">
                    <Button isLoading={isDeleting} colorScheme="red" mr={3} onClick={() => handleConfirmDelete(folder)}>
                        Delete
                    </Button>
                    <Button isLoading={isDeleting} variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
import {
    Box,
    Flex,
    Button,
    ButtonGroup,
    Divider,
    Image,
    Text, 
    Modal, 
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalBody,
    ModalFooter,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Input,
    Textarea
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLocationDot,
    faEllipsis, 
    faTrash, 
    faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import { LocationSearchBox } from './LocationSearchBox';


export const RestaurantModal = ({ handleDeleteRestaurant, handleUpdateRestaurant, restaurant, isOpen, onClose }) => {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [editMode, setEditMode] = useState(false);
    const [editedEvent, setEditedEvent] = useState(restaurant);

    const handleEdit = () => {
        setEditedEvent(restaurant)
        setEditMode(true);
    };

    const handleSave = () => {
        setEditMode(false);
        handleUpdateRestaurant(editedEvent)
    };
    
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedEvent(restaurant);
    };

    const handleDelete = () => {
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        handleDeleteRestaurant(restaurant);
        onDeleteClose();
    };

    const handleCancelDelete = () => {
        onDeleteClose();
    };

    const handleChange = (field, value) => {
        setEditedEvent(prev => ({ ...prev, [field]: value }));
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" bg="#F2F2F2">
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <Box mt="20px">
                        <Flex justifyContent="center">
                            <Image 
                                src={restaurant.thumbnail || 'https://via.placeholder.com/150'} 
                                alt={`Thumbnail for ${restaurant.title}`} 
                                fit="cover"
                                width="300px"
                                height="300px"
                                borderRadius={"10px"}
                            />
                        </Flex>
                        

                        <Box mt="24px" mb="20px" display="flex" justifyContent="space-between" alignItems="center">
                            { editMode ? (
                                <ButtonGroup>
                                    <Button onClick={handleSave} colorScheme='brown' variant='solid'>Save</Button>
                                    <Button onClick={handleCancelEdit} colorScheme='red' variant='outline'>Cancel</Button>
                                </ButtonGroup>
                            ) : (
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label='Options'
                                        icon={<FontAwesomeIcon fontSize="20px" icon={faEllipsis} />}
                                        variant='outline'
                                    />
                                    <MenuList>
                                        <MenuItem 
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                            onClick={() => { handleDelete() }}
                                        >
                                            Delete
                                        </MenuItem>
                                        <MenuItem 
                                            icon={<FontAwesomeIcon icon={faPenToSquare} />}
                                            onClick={() => { handleEdit() }}
                                        >
                                            Edit
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            ) }
                        </Box>

                        <Box mb="26px">
                            {editMode ? (
                                <Box>
                                    <Input
                                        value={editedEvent.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="Edit your title here"
                                        mb="8px"
                                    />
                                    <Textarea
                                        value={editedEvent.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Edit your description here"
                                    />
                                </Box>
                            ) : (
                                <Box>
                                    <Text fontSize="20px" fontWeight="semibold">{restaurant.title}</Text>
                                    <Text mt="8px" fontSize="16px" lineHeight="1.5rem">{restaurant.description || "This restaurant has no description"}</Text>
                                </Box>
                            )}
                        </Box>

                        <Divider height="2px" />

                        <Box mt="12px" display="flex" gap="8px" alignItems="center">
                            <FontAwesomeIcon color="#8F611B" icon={faLocationDot} />
                            {editMode ? (
                                <Box width="100%">
                                    <LocationSearchBox onSelectLocation={(location) => handleChange('location', location.text.text)} />
                                </Box>
                            ) : (
                                <Text maxW="90%" isTruncated color="#333333">{restaurant.location || "Unknown Location"}</Text>
                            )}
                        </Box>
                    </Box>
                </ModalBody>

                {isDeleteOpen && (
                        <Modal isOpen={isOpen} onClose={onDeleteClose} size="sm" bg="#F2F2F2" isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader fontWeight="semibold">Modal Title</ModalHeader>
                                <ModalCloseButton />
                                <Divider />
                                <ModalBody>
                                    <Text>Are you sure you want to continue with your action?</Text>
                                </ModalBody>
                                <Divider />
                                <ModalFooter>
                                    <Button mr="6px" variant="solid" colorScheme="red" onClick={handleConfirmDelete}>
                                        Confirm
                                    </Button>
                                    <Button variant="outline" colorScheme="red" onClick={handleCancelDelete}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    )}
            </ModalContent>
        </Modal>
    );
}
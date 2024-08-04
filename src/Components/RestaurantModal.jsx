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
    useDisclosure,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLocationDot,
    faTrash,
    faPenToSquare,
    faTags,
    faGlobeAmericas
} from '@fortawesome/free-solid-svg-icons';

import { useState, useMemo, useCallback } from 'react';
import { LocationSearchBox } from './LocationSearchBox';
import { ConfirmDiscardChangesModal } from './ConfirmDiscardChanges';
import Select from 'react-select';

export const RestaurantModal = ({ isLoading, handleDeleteRestaurant, handleUpdateRestaurant, restaurant, isOpen, onClose, folderList, regionLists }) => {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [editedRestaurant, setEditedRestaurant] = useState(restaurant);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isDiscardModalOpen, setDiscardModalOpen] = useState(false);

    const handleEdit = () => {
        setEditedRestaurant(restaurant);
        setEditMode(true);
    };

    const handleSave = () => {
        const newErrors = {};
        if (!editedRestaurant.title || !editedRestaurant.title.length) {
            newErrors.title = 'Title is required'
        }
        if (!editedRestaurant.region) {
            newErrors.region = 'Region is required';
        }
        if (!editedRestaurant.location || !editedRestaurant.location.length) {
            newErrors.location = 'Location is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setEditMode(false);
        handleUpdateRestaurant(editedRestaurant);
    };
    
    const handleCancelEdit = useCallback(() => {
        if (hasUnsavedChanges) {
            setDiscardModalOpen(true);
        } else {
            setEditMode(false);
            setEditedRestaurant(restaurant);
        }
    }, [hasUnsavedChanges, restaurant]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value && errors[name]) {
            errors[name] = ""
        }

        setEditedRestaurant(prev => ({
            ...prev,
            [name]: value
        }));

        setHasUnsavedChanges(true);
    };

    const handleLocationChange = (location) => {
        const locationText = location?.text?.text ?? ''
        if (locationText && errors.location) {
            errors.location = ""
        }

        setEditedRestaurant(prev => ({
            ...prev,
            location: locationText,
        }));

        setHasUnsavedChanges(true);
    }

    const handleFolderChange = (selectedOptions) => {
        const selectedFolderIds = selectedOptions ? selectedOptions.map(({ value }) => value) : []
        setEditedRestaurant(prev => ({
            ...prev,
            folders: selectedFolderIds,
        }));

        setHasUnsavedChanges(true);
    };

    const handleRegionChange = (selectedOption) => {
        const hasValue = selectedOption && selectedOption.value
        if (hasValue && errors.region) {
            errors["region"] = ""
        }

        setEditedRestaurant(prev => ({
            ...prev,
            region: selectedOption ? selectedOption.value : null
        }));

        setHasUnsavedChanges(true);
    }

    const folderMap = useMemo(() => {
        return folderList.reduce((acc, folder) => {
            const { id, name } = folder
            acc[id] = name
            return acc
        }, {})
    }, [folderList])

    const folderOptions = useMemo(() => {
        return folderList.map(folder => {
            const { id, name } = folder
            return { value: id, label: name }
        })
    }, [folderList])

    const regionOptions = regionLists.map(region => ({
        value: region,
        label: region,
    }));

    const handleCloseModal = useCallback(() => {
        if (editMode) {
            handleCancelEdit()
        } else {
            onClose()
        }
    }, [editMode, handleCancelEdit, onClose])

    const handleDiscardChanges = () => {
        setDiscardModalOpen(false);
        setEditMode(false)
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleCloseModal} size="4xl" bg="#F2F2F2">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text>Restaurant Details</Text>
                    </ModalHeader>
                    <Divider height="2px" />

                    <ModalBody>
                        <Flex>
                            <Box flex="1" p="4" display="flex" alignItems="center">
                                <Image 
                                    src={restaurant.thumbnail || 'https://via.placeholder.com/150'} 
                                    alt={`Thumbnail for ${restaurant.title}`} 
                                    fit="cover"
                                    width="100%"
                                    height="300px"
                                    borderRadius={"10px"}
                                />
                            </Box>
                            <Flex flexDir="column" flex="2" p="4">
                                <Box height="100%">
                                    {editMode ? (
                                        <Box width="100%">
                                            <FormControl isInvalid={errors.title} isRequired>
                                                <FormLabel>Title</FormLabel>
                                                <Input 
                                                    name="title" 
                                                    value={editedRestaurant.title} 
                                                    onChange={handleInputChange} 
                                                    placeholder="Edit your title here"
                                                    mb="8px"
                                                />
                                                { errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage> }
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Description</FormLabel>
                                                <Textarea
                                                    name="description"
                                                    value={editedRestaurant.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Edit your description here"
                                                    mb="8px"
                                                />
                                            </FormControl>

                                            <Flex gap="20px">
                                                <FormControl mt={4} isInvalid={errors.region} isRequired>
                                                    <FormLabel>Region</FormLabel>
                                                    <Select
                                                        name="region"
                                                        placeholder="Select a Region..."
                                                        value={{ value: editedRestaurant.region, label: editedRestaurant.region }}
                                                        options={regionOptions}
                                                        onChange={handleRegionChange}
                                                        styles={{
                                                            control: (provided, state) => ({
                                                                ...provided,
                                                                borderColor: errors.region ? '#E53E3E' : provided.borderColor,
                                                                '&:hover': {
                                                                    borderColor: errors.region ? '#E53E3E' : provided.borderColor
                                                                },
                                                                boxShadow: errors.region ? '0 0 0 1px #E53E3E' : state.isFocused ? '0 0 0 1px #3182ce' : provided.boxShadow,
                                                            })
                                                        }}
                                                    />
                                                    { errors.region && <FormErrorMessage>{errors.region}</FormErrorMessage> }
                                                </FormControl>
                                                <FormControl mt={4}>
                                                    <FormLabel>Folder</FormLabel>
                                                    <Select
                                                        name="folders"
                                                        placeholder="Select folders..."
                                                        value={editedRestaurant.folders?.map(folderId => ({ value: folderId, label: folderMap[folderId] }))}
                                                        options={folderOptions}
                                                        onChange={handleFolderChange}
                                                        closeMenuOnSelect={false}
                                                        isMulti
                                                        isClearable
                                                    />
                                                </FormControl>
                                            </Flex>

                                            <FormControl flex="1" mt={4} isInvalid={errors.location} isRequired>
                                                <FormLabel>Where is this</FormLabel>
                                                <LocationSearchBox currentLocation={restaurant.location} onSelectLocation={handleLocationChange} />
                                                { errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage> }
                                            </FormControl>
                                        </Box>
                                    ) : (
                                        <Box height="100%" display="flex" flexDir="column" justifyContent="space-between">
                                            <Text fontSize="20px" fontWeight="semibold" ml="8px" mb="8px">{restaurant.title}</Text>
                                            <Text fontSize="16px" lineHeight="1.5rem" ml="8px" mb="8px">{restaurant.description || "This restaurant has no description"}</Text>
                                            <Flex alignItems="center">
                                                <FontAwesomeIcon icon={faGlobeAmericas} color="#ea246e" />
                                                <Text fontSize="16px" lineHeight="1.5rem" ml="8px">{restaurant.region || "No region selected"}</Text>
                                            </Flex>
                                            <Flex alignItems="center">
                                                <FontAwesomeIcon icon={faTags} color="#ea246e" />
                                                <Text fontSize="16px" lineHeight="1.5rem" ml="8px">
                                                    {restaurant.folders?.map(folderId => folderList.find(folder => folder.id === folderId)?.name).join(', ') || "No folders selected"}
                                                </Text>
                                            </Flex>
                                            <Flex alignItems="center" gap="8px">
                                                <FontAwesomeIcon color="#ea246e" icon={faLocationDot} />
                                                <Text maxW="90%" isTruncated color="#333333">{restaurant.location || "Unknown Location"}</Text>
                                            </Flex>
                                        </Box>
                                    )}
                                </Box>
                            </Flex>
                        </Flex>
                    </ModalBody>
                    
                    <Divider height="2px" />

                    <ModalFooter>
                        <ButtonGroup spacing="6" flex="1" justifyContent="space-between">
                            <Button isLoading={isLoading} onClick={handleDelete} colorScheme="red" isDisabled={editMode}>
                                <Flex gap="8px">
                                    <FontAwesomeIcon icon={faTrash} />
                                    Delete
                                </Flex>
                            </Button>
                            {editMode ? (
                                <ButtonGroup>
                                    <Button isLoading={isLoading} bg="#ea246e" color="white" onClick={handleSave} variant="solid">Save</Button>
                                    <Button isLoading={isLoading} onClick={handleCancelEdit} variant="outline">Cancel</Button>
                                </ButtonGroup>
                            ) : (
                                <Button 
                                    bg="#ea246e" 
                                    color="white"
                                    onClick={handleEdit} 
                                    variant="solid"
                                    isLoading={isLoading}
                                >
                                    <Flex gap="8px">
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        Edit    
                                    </Flex>
                                </Button>
                            )}
                        </ButtonGroup>
                    </ModalFooter>

                    {isDeleteOpen && (
                        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm" bg="#F2F2F2" isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader fontWeight="semibold">Delete Confirmation</ModalHeader>
                                <ModalCloseButton />
                                <Divider />
                                <ModalBody>
                                    <Text>Are you sure you want to delete this restaurant?</Text>
                                </ModalBody>
                                <Divider />
                                <ModalFooter>
                                    <Button mr="6px" variant="solid" colorScheme="red" onClick={handleConfirmDelete}>
                                        Confirm
                                    </Button>
                                    <Button variant="outline" onClick={handleCancelDelete}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    )}
                </ModalContent>
            </Modal>

            <ConfirmDiscardChangesModal
                isOpen={isDiscardModalOpen}
                onClose={() => setDiscardModalOpen(false)}
                onConfirm={handleDiscardChanges}
            />
        </>
    );
};

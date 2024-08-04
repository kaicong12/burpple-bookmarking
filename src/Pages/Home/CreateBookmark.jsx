import {
    Box,
    Flex,
    Image,
    Modal, 
    Button,
    ModalOverlay,
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';

import { LocationSearchBox } from '../../Components/LocationSearchBox';


export const CreateBookmark = ({ isLoading, isAddModalOpen, onAddModalClose, handleAddRestaurant, regionLists, folderList }) => {
    const defaultRestaurantData = useMemo(() => ({
        title: '',
        description: '',
        region: null,
        location: null,
        folders: null,
        thumbnail: null,
    }), [])

    const [newRestaurant, setNewRestaurant] = useState(defaultRestaurantData)
    const [previewImage, setPreviewImage] = useState([])
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value && errors[name]) {
            errors[name] = ""
        }

        setNewRestaurant(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationChange = (location) => {
        const locationText = location?.text?.text ?? ''
        if (locationText && errors.location) {
            errors.location = ""
        }

        setNewRestaurant(prev => ({
            ...prev,
            location: locationText,
        }));
    }

    const handleRegionChange = (selectedOption) => {
        const hasValue = selectedOption && selectedOption.value
        if (hasValue && errors.region) {
            errors["region"] = ""
        }

        setNewRestaurant(prev => ({
            ...prev,
            region: selectedOption ? selectedOption.value : null
        }));
    }

    const handleFolderChange = (selectedOptions) => {
        const selectedFolderIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewRestaurant(prev => ({
            ...prev,
            folders: selectedFolderIds
        }));
    };

    const handleOnClose = () => {
        onAddModalClose()
        setNewRestaurant({
            title: '',
            description: '',
            region: null,
            location: null,
        })
        setPreviewImage([])
        setErrors({})
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setPreviewImage(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            
            if (acceptedFiles && errors.thumbnail) {
                errors.thumbnail = ""
            }
            
            setNewRestaurant(prev => ({
                ...prev,
                thumbnail: acceptedFiles[0]
            }));
        }
    });

    const removeImage = () => {
        setPreviewImage([]);
        setNewRestaurant(prev => ({
            ...prev,
            thumbnail: null
        }));
    };

    const handleSave = useCallback(async (newRestaurant) => {
        const newErrors = {};
        if (!newRestaurant.title || !newRestaurant.title.length) {
            newErrors.title = 'Title is required'
        }
        if (!newRestaurant.thumbnail) {
            newErrors.thumbnail = 'Thumbnail is required';
        }
        if (!newRestaurant.region) {
            newErrors.region = 'Region is required';
        }
        if (!newRestaurant.location || !newRestaurant.location.length) {
            newErrors.location = 'Location is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await handleAddRestaurant(newRestaurant);

        // reset the state
        setPreviewImage([])
        setNewRestaurant(defaultRestaurantData)
    }, [defaultRestaurantData, handleAddRestaurant])

    const folderOptions = folderList.map(folder => ({
        value: folder.id,
        label: folder.name
    }));

    const regionOptions = regionLists.map(region => ({
        value: region,
        label: region,
    }));

    return (
        <Modal isOpen={isAddModalOpen} onClose={handleOnClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Bookmark</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4} isInvalid={errors.thumbnail}>
                        { previewImage.length ? (
                            <Box display="flex" justifyContent="center"> {previewImage.map((image, imageIdx) => (
                                    <Box key={imageIdx} position="relative">
                                        <Image 
                                            key={imageIdx} 
                                            src={image.preview || 'https://via.placeholder.com/150'} 
                                            alt="Uploaded thumbnail" 
                                            fit="cover"
                                            width="200px"
                                            height="200px"
                                        />
                                        <IconButton
                                            borderRadius="100%"
                                            icon={<CloseIcon width="10px" height="10px" />}
                                            position="absolute"
                                            top="-20px"
                                            right="-20px"
                                            onClick={removeImage}
                                        />
                                    </Box>
                                ))} 
                            </Box>
                        ) : (
                            <div {...getRootProps()} style={{ 
                                    borderWidth: '2px',
                                    borderColor: errors.thumbnail ? '#E53E3E' : 'inherit',
                                    boxShadow: errors.thumbnail ? '0 0 0 1px #E53E3E' : 'inherit',
                                    padding: '20px', 
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>Upload thumbnail...</p>
                                }
                            </div>
                        ) }
                        { errors.thumbnail && <FormErrorMessage>{errors.thumbnail}</FormErrorMessage> }
                    </FormControl>
                    <FormControl isInvalid={errors.title} isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input name="title" value={newRestaurant.title} onChange={handleInputChange} />
                        { errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage> }
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input name="description" value={newRestaurant.description} onChange={handleInputChange} />
                    </FormControl>
                    <Flex gap="20px">
                        <FormControl mt={4} isInvalid={errors.region} isRequired>
                            <FormLabel>Region</FormLabel>
                            <Select
                                name="region"
                                placeholder="Select a Region..."
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
                        <LocationSearchBox onSelectLocation={handleLocationChange} />
                        { errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage> }
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={isLoading} bg="#ea246e" color="white" mr={3} onClick={() => handleSave(newRestaurant)}>
                        Save
                    </Button>
                    <Button isLoading={isLoading} onClick={handleOnClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
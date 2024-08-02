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
    Select,
    FormErrorMessage,
    IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { LocationSearchBox } from '../../Components/LocationSearchBox';


export const CreateBookmark = ({ newRestaurant, setNewRestaurant, isAddModalOpen, onAddModalClose, handleAddRestaurant, regionLists }) => {
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
        setNewRestaurant(prev => ({
            ...prev,
            location: locationText,
        }));
    }

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

    const handleSave = useCallback((newRestaurant) => {
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
        handleAddRestaurant(newRestaurant);
    }, [handleAddRestaurant])

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
                            <Select name="region" value={newRestaurant.region} onChange={handleInputChange}>
                                <option value="">Select a Region</option>
                                { regionLists.map(label => <option key={label} value={label}>{label}</option>) }
                            </Select>
                            { errors.region && <FormErrorMessage>{errors.region}</FormErrorMessage> }
                        </FormControl>
                        <FormControl mt={4} isInvalid={errors.folder}>
                            <FormLabel>Folder</FormLabel>
                            <Select name="folder" value={newRestaurant.folder} onChange={handleInputChange}>
                                <option value="">Select a Folder</option>
                                { regionLists.map(label => <option key={label} value={label}>{label}</option>) }
                            </Select>
                        </FormControl>
                    </Flex>
                    <FormControl flex="1" mt={4} isInvalid={errors.location} isRequired>
                        <FormLabel>Where is this</FormLabel>
                        <LocationSearchBox onSelectLocation={handleLocationChange} />
                        { errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage> }
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => handleSave(newRestaurant)}>
                        Save
                    </Button>
                    <Button onClick={handleOnClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
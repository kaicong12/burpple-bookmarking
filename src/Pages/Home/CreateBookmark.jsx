import {
    Box,
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
    FormErrorMessage
} from '@chakra-ui/react';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { LocationSearchBox } from '../../Components/LocationSearchBox';


export const CreateBookmark = ({ newRestaurant, setNewRestaurant, isAddModalOpen, onAddModalClose, handleAddRestaurant, regionLists }) => {
    const [previewImage, setPreviewImage] = useState([])
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
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

    const handleSave = useCallback((newRestaurant) => {
        console.log(newRestaurant)
        const newErrors = {};
        if (!newRestaurant.title || !newRestaurant.title.length) {
            newErrors.title = 'Title is required'
        }
        if (!newRestaurant.thumbnail) {
            newErrors.file = 'Thumbnail is required';
        }
        if (!newRestaurant.region) {
            newErrors.category = 'Category is required';
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
        <Modal isOpen={isAddModalOpen} onClose={handleOnClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Bookmark</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4} isInvalid={errors.file}>
                        { previewImage.length ? (
                            <Box display="flex" justifyContent="center"> {previewImage.map((image, imageIdx) => (
                                <Image 
                                    key={imageIdx} 
                                    src={image.preview || 'https://via.placeholder.com/150'} 
                                    alt="Uploaded thumbnail" 
                                    fit="cover"
                                    width="300px"
                                    height="300px"
                                />
                            ))} </Box>
                        ) : (
                            <div {...getRootProps()} style={{ 
                                    borderWidth: '2px',
                                    borderColor: errors.file ? '#E53E3E' : 'inherit',
                                    boxShadow: errors.file ? '0 0 0 1px #E53E3E' : 'inherit',
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
                        { errors.thumbnail && <FormErrorMessage>{errors.file}</FormErrorMessage> }
                    </FormControl>
                    <FormControl isInvalid={errors.title}>
                        <FormLabel>Title</FormLabel>
                        <Input name="title" value={newRestaurant.title} onChange={handleInputChange} />
                        { errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage> }
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input name="description" value={newRestaurant.description} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.category}>
                        <FormLabel>Category</FormLabel>
                        <Select name="region" value={newRestaurant.region} onChange={handleInputChange}>
                            <option value="">Select a Region</option>
                            { regionLists.map(label => <option key={label} value={label}>{label}</option>) }
                        </Select>
                        { errors.region && <FormErrorMessage>{errors.category}</FormErrorMessage> }
                    </FormControl>
                    <FormControl flex="1" mt={4} isInvalid={errors.location}>
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
import {
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
    Textarea
} from '@chakra-ui/react';
import { useState, useCallback } from 'react';


export const CreateFolderModal = ({ newFolder, setNewFolder, isAddModalOpen, onAddModalClose, handleAddFolder }) => {
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value && errors[name]) {
            errors[name] = ""
        }

        setNewFolder(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOnClose = () => {
        onAddModalClose();
        setNewFolder({
            name: '',
            description: ''
        });
        setErrors({});
    };

    const handleSave = useCallback((newFolder) => {
        const newErrors = {};
        if (!newFolder.name || !newFolder.name.length) {
            newErrors.name = 'A Folder name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        handleAddFolder(newFolder);
    }, [handleAddFolder]);

    return (
        <Modal isOpen={isAddModalOpen} onClose={handleOnClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Folder</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={errors.name} isRequired>
                        <FormLabel>Folder Name</FormLabel>
                        <Input name="name" value={newFolder.name} onChange={handleInputChange} />
                        {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Textarea name="description" value={newFolder.description} onChange={handleInputChange} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button bg="#ea246e" color="white" mr={3} onClick={() => handleSave(newFolder)}>
                        Save
                    </Button>
                    <Button variant="outline" onClick={handleOnClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

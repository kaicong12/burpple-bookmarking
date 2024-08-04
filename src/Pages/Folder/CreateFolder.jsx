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

import { ConfirmDiscardChangesModal } from '../../Components/ConfirmDiscardChanges';


export const CreateFolderModal = ({ newFolder, setNewFolder, isAddModalOpen, onAddModalClose, handleAddFolder, handleEditFolder, isEdit }) => {
    const [errors, setErrors] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isDiscardModalOpen, setDiscardModalOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value && errors[name]) {
            errors[name] = ""
        }

        setNewFolder(prev => ({
            ...prev,
            [name]: value
        }));

        setHasUnsavedChanges(true);
    };

    const closeModal = () => {
        onAddModalClose();
        setNewFolder({
            name: '',
            description: ''
        });
        setErrors({});
        setHasUnsavedChanges(false);
    };

    const handleOnClose = () => {
        if (hasUnsavedChanges) {
            setDiscardModalOpen(true);
        } else {
            closeModal();
        }
    };

    const handleDiscardChanges = () => {
        setDiscardModalOpen(false);
        closeModal();
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

        if (isEdit) {
            handleEditFolder(newFolder);
        } else {
            handleAddFolder(newFolder);
        }

        setHasUnsavedChanges(false);
    }, [handleAddFolder, handleEditFolder, isEdit]);

    return (
        <>
            <Modal isOpen={isAddModalOpen} onClose={handleOnClose} size="md" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEdit ? 'Edit Folder' : 'Create New Folder'}</ModalHeader>
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
                            {isEdit ? 'Save Changes' : 'Save'}
                        </Button>
                        <Button variant="outline" onClick={handleOnClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ConfirmDiscardChangesModal
                isOpen={isDiscardModalOpen}
                onClose={() => setDiscardModalOpen(false)}
                onConfirm={handleDiscardChanges}
            />
        </>
    )
}

import {
    Modal,
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalBody,
} from '@chakra-ui/react';


export const ConfirmDiscardChangesModal = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Discard Changes</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Are you sure you want to discard your changes?
            </ModalBody>
            <ModalFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button bg="#ea246e" color="white" ml={3} onClick={onConfirm}>Yes, Discard</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);
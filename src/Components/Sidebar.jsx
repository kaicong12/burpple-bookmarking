import React from 'react';
import {
  Box,
  VStack,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose,
    } = useDisclosure();
    const { currentUser, handleLogout: logout } = useAuth();

    const handleLogout = () => {
        onModalOpen();
    };

    const confirmLogout = () => {
        logout();
        onModalClose();
    };

    return (
        <>
            <IconButton
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="outline"
                aria-label="Open Menu"
            />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>

                    <DrawerBody>
                    <VStack spacing={4} align="stretch">
                        <Box>
                        <Avatar name={currentUser.name} src={currentUser.avatar} />
                        <Text mt={2}>{currentUser.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                            {currentUser.email}
                        </Text>
                        </Box>
                        <Button onClick={handleLogout} colorScheme="red">
                            Logout
                        </Button>
                    </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Logout</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to logout?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={confirmLogout}>
                            Confirm
                        </Button>
                        <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

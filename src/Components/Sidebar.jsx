import React from 'react';
import {
    Box,
    Divider,
    Flex,
    Text,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tabs,
    TabList,
    Tab,
    TabIndicator,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useBookmarkList } from '../Pages/Home/useBookmarkList'
import { RestaurantModal } from './RestaurantModal'


export const Sidebar = () => {
    const { onClose } = useDisclosure();
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose,
    } = useDisclosure();
    const navigate = useNavigate();
    const { currentUser, handleLogout: logout } = useAuth();

    const handleLogout = () => {
        onModalOpen();
    };

    const confirmLogout = () => {
        logout();
        onModalClose();
    };

    const navigateTo = (path) => {
        navigate(path);
        onClose();
    };

    const {
        isRestaurantCardOpen, 
        onCloseRestaurantCard, 
        selectedRestaurant
    } = useRestaurant()

    const {
        regionLists,
        folderList,
        handleUpdateRestaurant,
        handleDeleteRestaurant,
    } = useBookmarkList()

    return (
        <Box bg="white">
            <Flex justifyContent="space-around" alignItems="center" padding="10px">
                <Image 
                    src={"burppleLogo.png"} 
                    alt="Burpple Logo"
                    width="150px"
                    height="30px"
                    fit="contain"
                />
                
                <Menu>
                    <MenuButton>
                        <Flex alignItems="center">
                            <Avatar mr="4px" name={currentUser.displayName} src={currentUser.photoUrl} size="sm" />
                            <Text 
                                maxW="50px" 
                                isTruncated 
                                fontWeight="600" 
                                color="#555" 
                                fontSize="12px"
                            >
                                {currentUser.displayName}
                            </Text>
                            <ChevronDownIcon />
                        </Flex>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            <Divider />

            <Tabs align='center' variant='unstyled' mt="-5px">
                <TabList padding="5px">
                    <Tab onClick={() => navigateTo('/home')}>
                        <Text 
                            color="#555555" 
                            fontWeight="600" 
                            fontFamily={"'proxima-nova' 'Helvetica Neue'"} 
                            fontSize="15px"
                        >
                            Bookmark
                        </Text>
                    </Tab>
                    <Tab onClick={() => navigateTo('/folder')}>
                        <Text 
                            color="#555555" 
                            fontWeight="600" 
                            fontFamily={"'proxima-nova' 'Helvetica Neue'"} 
                            fontSize="15px"
                        >
                            Folder
                        </Text>
                    </Tab>
                </TabList>
                <TabIndicator mt='-10px' height='2px' bg='#ea246e' borderRadius='1px' />
            </Tabs>

            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Logout</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>Are you sure you want to logout?</ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr="8px" onClick={confirmLogout}>
                            Confirm
                        </Button>
                        <Button variant="ghost" onClick={onModalClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {selectedRestaurant && (
                <RestaurantModal 
                    handleDeleteRestaurant={handleDeleteRestaurant}
                    handleUpdateRestaurant={handleUpdateRestaurant}
                    restaurant={selectedRestaurant} 
                    isOpen={isRestaurantCardOpen} 
                    onClose={onCloseRestaurantCard}
                    folderList={folderList}
                    regionLists={regionLists}
                />
            )}
        </Box>
    );
}

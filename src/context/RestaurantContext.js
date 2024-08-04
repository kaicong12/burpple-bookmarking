import React, { createContext, useContext, useState, useCallback } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { 
    uploadRestaurant,
    deleteRestaurant,
    updateRestaurant
} from '../db';

import { useRecoilRefresher_UNSTABLE } from 'recoil'
import { restaurantListState } from '../Pages/Home/state';
import { folderListState } from '../Pages/Folder/state';


const RestaurantContext = createContext()

export const RestaurantProvider = ({ children }) => {
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const { isOpen: isRestaurantCardOpen, onOpen: onOpenRestaurantCard, onClose: onCloseRestaurantCard } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();

    const onSyncRestaurants = useRecoilRefresher_UNSTABLE(restaurantListState);
    const onSyncFolders = useRecoilRefresher_UNSTABLE(folderListState)

    const onSync = useCallback(() => {
        onSyncRestaurants()
        onSyncFolders()
    }, [onSyncRestaurants, onSyncFolders])

    const handleCardClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        onOpenRestaurantCard();
    }

    const handleAddRestaurant = async (newRestaurant) => {
        setIsModalLoading(true)

        try {
            await uploadRestaurant(newRestaurant)
            setIsModalLoading(false)
        } catch (err) {
            console.log(err)
        } finally {
            onSync()
        }
        
        onAddModalClose();
    };

    const handleDeleteRestaurant = async (restaurant) => {
        setIsModalLoading(true)

        try {
            await deleteRestaurant(restaurant.id)
            setIsModalLoading(false)
        } catch (err) {
            console.log(err, 'delete restaurant failed')
        } finally {
            onSync()
            onCloseRestaurantCard();
        }
    };

    const handleUpdateRestaurant = async (restaurant) => {
        setIsModalLoading(true)

        try {
            await updateRestaurant(restaurant)
            setIsModalLoading(false)
        } catch (err) {
            console.log(err, 'error updating restaurant')
        } finally {
            onSync()
            handleCardClick(restaurant)
        }
    }

    return (
        <RestaurantContext.Provider 
            value={{ 
                selectedRestaurant, 
                isRestaurantCardOpen, 
                onCloseRestaurantCard,
                handleCardClick,
                isModalLoading,
                isAddModalOpen,
                onAddModalOpen,
                onAddModalClose,
                handleAddRestaurant,
                handleDeleteRestaurant,
                handleUpdateRestaurant,
            }}
        >
            {children}
        </RestaurantContext.Provider>
    );
};


export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
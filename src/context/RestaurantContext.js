import React, { createContext, useContext, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';


const RestaurantContext = createContext()

export const RestaurantProvider = ({ children }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const { isOpen: isRestaurantCardOpen, onOpen: onOpenRestaurantCard, onClose: onCloseRestaurantCard } = useDisclosure();

    const handleCardClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        onOpenRestaurantCard();
    }

    return (
        <RestaurantContext.Provider 
            value={{ 
                selectedRestaurant, 
                isRestaurantCardOpen, 
                onCloseRestaurantCard,
                handleCardClick
            }}
        >
            {children}
        </RestaurantContext.Provider>
    );
};


export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
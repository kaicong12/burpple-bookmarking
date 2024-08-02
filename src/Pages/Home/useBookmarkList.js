import { useState, useMemo, useCallback, useEffect } from "react"
import { useDisclosure } from '@chakra-ui/react';
import Fuse from 'fuse.js';

import { 
    getBookmarkedRestaurants,
    uploadRestaurant,
    deleteRestaurant,
    updateRestaurant
} from "../../db";



export const useBookmarkList = () => {
    const defaultRestaurantData = {
        title: '',
        description: '',
        region: null,
        location: null,
    }

    const [isLoading, setIsLoading] = useState(true)
    const { isOpen: isRestaurantCardOpen, onOpen: onOpenRestaurantCard, onClose: onCloseRestaurantCard } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const [newRestaurant, setNewRestaurant] = useState(defaultRestaurantData)
    const [restaurantList, setRestaurantList] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const sortOptions = useMemo(() => {
        return [
            'Created At (Latest To Oldest)',
            'Created At (Oldest To Latest)',
            'Title (A to Z)',
            'Title (Z to Z)',
        ]
    }, [])

    const regionLists = useMemo(() => {
        return [
            'Central, Singapore',
            'North, Singapore',
            'Ang Mo Kio',
            'Bishan'
        ]
    }, [])

    const fuzzySearchRestaurants = useCallback((events, query) => {
        const options = {
            keys: ['title', 'description', 'region', 'location'],
            includeScore: true,
            threshold: 0.4,
        };
    
        const fuse = new Fuse(events, options);
        return fuse.search(query).map(result => result.item);
    }, [])

    const fetchRestaurants = async () => {
        setIsLoading(true)
        
        try {
            const eventData = await getBookmarkedRestaurants()
            setRestaurantList(eventData)
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCardClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        onOpenRestaurantCard();
    };

    const handleAddRestaurant = async (newRestaurant) => {
        setIsLoading(true);

        try {
            await uploadRestaurant(newRestaurant)
            await fetchRestaurants()
        } catch (err) {
            console.log(err)
        } finally {
            setNewRestaurant(defaultRestaurantData)
            setIsLoading(false)
        }
        
        onAddModalClose();
    };

    const handleDeleteRestaurant = async (restaurant) => {
        setIsLoading(true)

        try {
            await deleteRestaurant(restaurant.id)
            await fetchRestaurants()
        } catch (err) {
            console.log(err, 'delete restaurant failed')
        } finally {
            setIsLoading(false)
            onCloseRestaurantCard();
        }
    };

    const handleUpdateRestaurant = async (restaurant) => {
        setIsLoading(true)

        try {
            await updateRestaurant(restaurant)
            await fetchRestaurants()
        } catch (err) {
            console.log(err, 'error updating restaurant')
        } finally {
            handleCardClick(restaurant)
        }
    }

    useEffect(() => {
        fetchRestaurants()
    }, [])

    return {
        regionLists,
        isLoading,
        newRestaurant,
        setNewRestaurant,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        isRestaurantCardOpen,
        restaurantList,
        selectedRestaurant,
        sortOptions,
        fuzzySearchRestaurants,
        handleAddRestaurant,
        handleDeleteRestaurant,
        handleUpdateRestaurant
    }
}
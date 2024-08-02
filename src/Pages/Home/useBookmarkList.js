import { useState, useMemo, useCallback, useEffect } from "react"
import { useDisclosure } from '@chakra-ui/react';
import { 
    useRecoilState,
    useRecoilValueLoadable
} from "recoil";
import { 
    getBookmarkedRestaurants,
    uploadRestaurant,
    deleteRestaurant,
    updateRestaurant
} from "../../db";
import { 
    searchState,
    sortByState,
    regionFilterState,
    restaurantListState
} from "./state";
import { folderListState } from "../Folder/state";



export const useBookmarkList = () => {
    const defaultRestaurantData = {
        title: '',
        description: '',
        region: null,
        location: null,
    }

    const [isGlobalLoading, setIsGlobalLoading] = useState(false)
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true)
    const [isLoadingFolders, setIsLoadingFolders] = useState(true)
    const { isOpen: isRestaurantCardOpen, onOpen: onOpenRestaurantCard, onClose: onCloseRestaurantCard } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const [newRestaurant, setNewRestaurant] = useState(defaultRestaurantData)
    const [restaurantList, setRestaurantList] = useState([])
    const [folderList, setFolderList] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchValue, setSearchValue] = useRecoilState(searchState);
    const [sortByValue, setSortByValue] = useRecoilState(sortByState);
    const [regionFilters, setRegionFilters] = useRecoilState(regionFilterState)

    const onRegionFilterChange = useCallback((values) => {
        setRegionFilters(values)
    }, [setRegionFilters])

    const onSearchInputChange = useCallback((value) => {
        setSearchValue(value || "");
    }, [setSearchValue]);

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

    const fetchRestaurants = async () => {
        try {
            const restaurantData = await getBookmarkedRestaurants()
            setRestaurantList(restaurantData)
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    const handleCardClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        onOpenRestaurantCard();
    };

    const handleAddRestaurant = async (newRestaurant) => {
        setIsGlobalLoading(true)
        setIsLoadingRestaurants(true);

        try {
            await uploadRestaurant(newRestaurant)
            await fetchRestaurants()
        } catch (err) {
            console.log(err)
        } finally {
            setNewRestaurant(defaultRestaurantData)
            setIsLoadingRestaurants(false)
            setIsGlobalLoading(false)
        }
        
        onAddModalClose();
    };

    const handleDeleteRestaurant = async (restaurant) => {
        setIsGlobalLoading(true)
        setIsLoadingRestaurants(true)

        try {
            await deleteRestaurant(restaurant.id)
            await fetchRestaurants()
        } catch (err) {
            console.log(err, 'delete restaurant failed')
        } finally {
            setIsLoadingRestaurants(false)
            setIsGlobalLoading(false)
            onCloseRestaurantCard();
        }
    };

    const handleUpdateRestaurant = async (restaurant) => {
        setIsGlobalLoading(true)
        setIsLoadingRestaurants(true)

        try {
            await updateRestaurant(restaurant)
            await fetchRestaurants()
        } catch (err) {
            console.log(err, 'error updating restaurant')
        } finally {
            setIsLoadingRestaurants(true)
            setIsGlobalLoading(false)
            handleCardClick(restaurant)
        }
    }

    const restaurantListLoadable = useRecoilValueLoadable(restaurantListState);
    useEffect(() => {
        if (restaurantListLoadable.state === "loading") {
            setIsLoadingRestaurants(true);
        } else if (restaurantListLoadable.state === "hasValue") {
            setRestaurantList(restaurantListLoadable.contents)
            setIsLoadingRestaurants(false);
        } else if (restaurantListLoadable.state === "hasError") {
            setRestaurantList([]);
            setIsLoadingRestaurants(false);
        }
    }, [restaurantListLoadable, setIsLoadingRestaurants]);

    const folderListLoadable = useRecoilValueLoadable(folderListState);
    useEffect(() => {
        if (folderListLoadable.state === "loading") {
            setIsLoadingFolders(true);
        } else if (folderListLoadable.state === "hasValue") {
            setFolderList(folderListLoadable.contents)
            setIsLoadingFolders(false);
        } else if (folderListLoadable.state === "hasError") {
            setRestaurantList([]);
            setIsLoadingFolders(false);
        }
    }, [folderListLoadable, setIsLoadingRestaurants]);
    

    return {
        searchValue,
        sortByValue,
        regionFilters,
        onRegionFilterChange,
        regionLists,
        isGlobalLoading,
        isLoadingRestaurants,
        isLoadingFolders,
        newRestaurant,
        setNewRestaurant,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        isRestaurantCardOpen,
        onCloseRestaurantCard,
        restaurantList,
        folderList,
        selectedRestaurant,
        sortOptions,
        handleAddRestaurant,
        handleDeleteRestaurant,
        handleUpdateRestaurant,
        onSearchInputChange,
        setSortByValue,
        setRegionFilters,
        handleCardClick
    }
}
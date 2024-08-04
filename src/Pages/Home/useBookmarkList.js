import { useState, useMemo, useCallback, useEffect } from "react"
import { useDisclosure } from '@chakra-ui/react';
import { 
    useRecoilState,
    useRecoilValueLoadable,
    useRecoilRefresher_UNSTABLE
} from "recoil";
import {
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
import { useRestaurant } from "../../context/RestaurantContext"


export const useBookmarkList = () => {
    const defaultRestaurantData = {
        title: '',
        description: '',
        region: null,
        location: null,
        folders: null
    }

    const { handleCardClick, onCloseRestaurantCard } = useRestaurant()
    const [isGlobalLoading, setIsGlobalLoading] = useState(false)
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true)
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const [newRestaurant, setNewRestaurant] = useState(defaultRestaurantData)
    const [restaurantList, setRestaurantList] = useState([])
    const [folderList, setFolderList] = useState([])
    const [searchValue, setSearchValue] = useRecoilState(searchState);
    const [sortByValue, setSortByValue] = useRecoilState(sortByState);
    const [regionFilters, setRegionFilters] = useRecoilState(regionFilterState)

    const onSyncRestaurants = useRecoilRefresher_UNSTABLE(restaurantListState);
    const onSyncFolders = useRecoilRefresher_UNSTABLE(folderListState)

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
            'Title (Z to A)',
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

    const onSync = useCallback(() => {
        onSyncRestaurants()
        onSyncFolders()
    }, [onSyncRestaurants, onSyncFolders])

    const handleAddRestaurant = async (newRestaurant) => {
        setIsGlobalLoading(true)
        setIsLoadingRestaurants(true);

        try {
            await uploadRestaurant(newRestaurant)
            onSync()
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
            onSync()
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
            onSync()
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
        if (folderListLoadable.state === "hasValue") {
            setFolderList(folderListLoadable.contents)
        } else if (folderListLoadable.state === "hasError") {
            setFolderList([]);
        }
    }, [folderListLoadable.contents, folderListLoadable.state]);
    

    return {
        searchValue,
        sortByValue,
        regionFilters,
        onRegionFilterChange,
        regionLists,
        folderList,
        isGlobalLoading,
        isLoadingRestaurants,
        newRestaurant,
        setNewRestaurant,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        restaurantList,
        sortOptions,
        handleAddRestaurant,
        handleDeleteRestaurant,
        handleUpdateRestaurant,
        onSearchInputChange,
        setSortByValue,
        setRegionFilters,
    }
}
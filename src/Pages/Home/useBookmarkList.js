import { useState, useMemo, useCallback, useEffect } from "react"
import { 
    useRecoilState,
    useRecoilValueLoadable,
} from "recoil";

import { 
    searchState,
    sortByState,
    regionFilterState,
    restaurantListState
} from "./state";
import { folderListState } from "../Folder/state";


export const useBookmarkList = () => {

    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true)
    
    const [restaurantList, setRestaurantList] = useState([])
    const [folderList, setFolderList] = useState([])
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
            'Title (Z to A)',
        ]
    }, [])

    const regionLists = useMemo(() => {
        return [
            'Central, Singapore',
            'North, Singapore',
            'North East, Singapore',
            'East, Singapore',
            'West, Singapore',
        ]
    }, [])

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
        isLoadingRestaurants,
        restaurantList,
        sortOptions,
        onSearchInputChange,
        setSortByValue,
        setRegionFilters,
    }
}
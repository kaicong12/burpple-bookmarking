import { atom, selector } from "recoil";
import { getBookmarkedRestaurants } from "../../db";
import { fuzzySearch } from "../../utils";


export const searchState = atom({
    key: "restaurantList.searchStateAtom",
    default: "",
});

export const regionFilterState = atom({
    key: "restaurantList.regionFilterState",
    default: []
})

export const sortByState = atom({
    key: "restaurantList.sortByState",
    default: "Title (A to Z)"
})

export const restaurantListState = selector({
    key: "restaurantListState",
    get: async ({ get }) => {
        const regionFilters = get(regionFilterState);
        const search = get(searchState);
        const orderBy = get(sortByState);

        const restaurantList = await getBookmarkedRestaurants()
        const restaurantMatchesSearch = search ? fuzzySearch(restaurantList, search) : restaurantList
        const filteredRestaurantList = restaurantMatchesSearch.filter(restaurant => {
            const { region = '' } = restaurant
            return regionFilters.length === 0 || regionFilters.includes(region)
        })

        const sortedRestaurantList = filteredRestaurantList.sort((a, b) => {
            switch (orderBy) {
                case 'Created At (Latest To Oldest)':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'Created At (Oldest To Latest)':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'Title (A to Z)':
                    return a.title.localeCompare(b.title);
                case 'Title (Z to A)':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return sortedRestaurantList;
    },
});
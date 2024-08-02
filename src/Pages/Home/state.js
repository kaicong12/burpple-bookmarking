import { atom, selector } from "recoil";
import { getBookmarkedRestaurants } from "../../db";


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

        return restaurantList;
    },
});
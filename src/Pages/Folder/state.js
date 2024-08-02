import { atom, selector } from "recoil";
import { getBookmarkedRestaurants } from "../../db";


export const searchState = atom({
    key: "folderList.searchStateAtom",
    default: "",
});

export const sortByState = atom({
    key: "folderList.sortByState",
    default: "Name (A to Z)"
})

export const folderListState = selector({
    key: "folderListState",
    get: async ({ get }) => {
        const search = get(searchState);
        const orderBy = get(sortByState);

        const folderList = await getBookmarkedRestaurants()

        return folderList;
    },
});
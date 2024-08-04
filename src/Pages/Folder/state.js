import { selector } from "recoil";
import { getAllFolders, getRestaurantById } from "../../db";


export const folderListState = selector({
    key: "folderList.folderListState",
    get: async () => {
        const allFolders = await getAllFolders()
        const folderWithRestaurants = await Promise.all(allFolders.map(async (folder) => {
            const { restaurants = [] } = folder;
            const restaurantWithinFolders = await Promise.all(restaurants.map(async (restaurantId) => await getRestaurantById(restaurantId)))

            return {
                ...folder,
                restaurants: restaurantWithinFolders
            };
        }))

        return folderWithRestaurants;
    },
});

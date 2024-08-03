import { v4 as uuidv4 } from 'uuid';
import { db } from "./firebase";
import { doc, getDoc, deleteDoc, collection, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


export const getBookmarkedRestaurants = async () => {
    const colRef = collection(db, "bookmarkedRestaurants");
    const restaurantSnapShot = await getDocs(colRef);

    const eventList = restaurantSnapShot.docs.map(doc => ( { id: doc.id, ...doc.data() } ));
    return eventList;
}

export const getRestaurantById = async (restaurantId) => {
    const restaurantDocRef = doc(db, "bookmarkedRestaurants", restaurantId);
    const docSnap = await getDoc(restaurantDocRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("No such restaurant!");
    }
};

const updateFolderWithRestaurantId = async (folderId, restaurantId) => {
    const folderDocRef = doc(db, "folderList", folderId);
    const folderSnap = await getDoc(folderDocRef);

    if (folderSnap.exists()) {
        const folderData = folderSnap.data();
        const updatedRestaurants = folderData.restaurants ? arrayUnion(restaurantId) : [restaurantId];
        await updateDoc(folderDocRef, { restaurants: updatedRestaurants });
    } else {
        throw new Error(`Folder with ID ${folderId} does not exist!`);
    }
}

export const uploadRestaurant = async (newRestaurants) => {
    const colRef = collection(db, "bookmarkedRestaurants");
    const { thumbnail, folders: folderIds, ...restaurantData } = newRestaurants

    const completeRestaurantData = { ...restaurantData, folders: folderIds, createdAt: Date.now() }
    const storage = getStorage();

    try {
        if (thumbnail) {
            const storageRef = ref(storage, `bookmarkedRestaurants/${uuidv4()}-${thumbnail.name}`);
            const fileSnapshot = await uploadBytes(storageRef, thumbnail);
            const photoURL = await getDownloadURL(fileSnapshot.ref);
            completeRestaurantData["thumbnail"] = photoURL
        }

        const docRef = await addDoc(colRef, completeRestaurantData);
        if (folderIds) {
            const updatePromises = folderIds.map(folderId => updateFolderWithRestaurantId(folderId, docRef.id));
            await Promise.all(updatePromises);
        }

        return docRef.id
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to upload restaurant: " + e.message);
    }
}

export const deleteRestaurant = async (restaurantId) => {
    const restaurantDocRef = doc(db, "bookmarkedRestaurants", restaurantId);
    const storage = getStorage();

    try {
        const docSnap = await getDoc(restaurantDocRef);
        if (!docSnap.exists()) {
            throw new Error("Document does not exist!");
        }
        
        // remove thumbnail from storage if exists
        const restaurantData = docSnap.data();
        if (restaurantData.thumbnail) {
            const fileRef = ref(storage, restaurantData.thumbnail);
            await deleteObject(fileRef);
        }

        // Remove the restaurant from the folder if it exists
        if (restaurantData.folders) {
            const updateFolderPromises = restaurantData.folders.map(async (folderId) => {
                const folderDocRef = doc(db, "folderList", folderId);
                const folderSnap = await getDoc(folderDocRef);
                if (folderSnap.exists()) {
                    const folderData = folderSnap.data();
                    const updatedRestaurants = folderData.restaurants.filter(id => id !== restaurantId);
                    await updateDoc(folderDocRef, { restaurants: updatedRestaurants });
                }
            });
            await Promise.all(updateFolderPromises);
        }

        await deleteDoc(restaurantDocRef);
    } catch (e) {
        console.error("Error deleting restaurant: ", e);
        throw new Error("Failed to delete restaurant: " + e.message);
    }
}

export const updateRestaurant = async (restaurant) => {
    const { id: restaurantId, thumbnail, folder: folderIds, ...restaurantData } = restaurant
    const restaurantDocRef = doc(db, "bookmarkedRestaurants", restaurantId);
    const storage = getStorage();

    try {
        // If there's a new file to update the thumbnail
        if (thumbnail) {
            // Check if there's an existing thumbnail to delete
            const docSnap = await getDoc(restaurantDocRef);
            if (docSnap.exists() && docSnap.data().thumbnail) {
                const oldThumbnailRef = ref(storage, docSnap.data().thumbnail);
                await deleteObject(oldThumbnailRef);  // Delete the old thumbnail
            }

            // Upload the new file and update the thumbnail URL
            const newFileRef = ref(storage, `bookmarkedRestaurants/${thumbnail.name}`);
            const fileSnapshot = await uploadBytes(newFileRef, thumbnail);
            const newThumbnailURL = await getDownloadURL(fileSnapshot.ref);
            restaurantData.thumbnail = newThumbnailURL;  // Update thumbnail URL in event data
        }

        // Update the event document with new data
        await updateDoc(restaurantDocRef, { ...restaurantData, folder: folderIds });
        if (folderIds) {
            const updatePromises = folderIds.map(folderId => updateFolderWithRestaurantId(folderId, restaurantId));
            await Promise.all(updatePromises);
        }

        return restaurantId;  // Return the event ID to confirm the update
    } catch (e) {
        console.error("Error updating event: ", e);
        throw new Error("Failed to update event: " + e.message);
    }
}

export const getAllFolders = async () => {
    const colRef = collection(db, "folderList");
    try {
        const folderSnapShot = await getDocs(colRef);
        const folderList = folderSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return folderList;
    } catch (e) {
        console.error("Error getting folders: ", e);
        throw new Error("Failed to get folders: " + e.message);
    }
}

export const addFolder = async (newFolder) => {
    const colRef = collection(db, "folderList");
    const docRef = await addDoc(colRef, newFolder);
    return docRef.id;
};

export const updateFolder = async (folderId, updatedFolder) => {
    const folderDocRef = doc(db, "folderList", folderId);
    await updateDoc(folderDocRef, updatedFolder);
};

export const deleteFolder = async (folderId) => {
    // Remove folder reference from restaurants
    const restaurantsColRef = collection(db, "bookmarkedRestaurants");
    const restaurantSnapshot = await getDocs(restaurantsColRef);

    restaurantSnapshot.docs.forEach(async (restaurantDoc) => {
        const restaurantData = restaurantDoc.data();
        if (restaurantData.folderIds && restaurantData.folderIds.includes(folderId)) {
            const updatedFolderIds = restaurantData.folderIds.filter(id => id !== folderId);
            await updateDoc(restaurantDoc.ref, { folderIds: updatedFolderIds });
        }
    });

    // Delete the folder
    const folderDocRef = doc(db, "folderList", folderId);
    await deleteDoc(folderDocRef);
};
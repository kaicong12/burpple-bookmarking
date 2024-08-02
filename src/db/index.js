import { db } from "./firebase";
import { doc, getDoc, deleteDoc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


export const getBookmarkedRestaurants = async () => {
    const colRef = collection(db, "bookmarkedRestaurants");
    const restaurantSnapShot = await getDocs(colRef);

    const eventList = restaurantSnapShot.docs.map(doc => ( { id: doc.id, ...doc.data() } ));
    return eventList;
}

export const uploadRestaurant = async (newRestaurants) => {
    const colRef = collection(db, "bookmarkedRestaurants");
    const { thumbnail, ...eventData } = newRestaurants

    const completeRestaurantData = { ...eventData, createdAt: Date.now() }
    const storage = getStorage();

    try {
        if (thumbnail) {
            const storageRef = ref(storage, `bookmarkedRestaurants/${thumbnail.name}`);
            const fileSnapshot = await uploadBytes(storageRef, thumbnail);
            const photoURL = await getDownloadURL(fileSnapshot.ref);
            completeRestaurantData["thumbnail"] = photoURL
        }

        const docRef = await addDoc(colRef, completeRestaurantData);
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
        
        const eventData = docSnap.data();
        if (eventData.thumbnail) {
            const fileRef = ref(storage, eventData.thumbnail);
            await deleteObject(fileRef);
        }

        await deleteDoc(restaurantDocRef);
    } catch (e) {
        console.error("Error deleting restaurant: ", e);
        throw new Error("Failed to delete restaurant: " + e.message);
    }
}

export const updateRestaurant = async (restaurant) => {
    const { id: restaurantId, thumbnail, ...restaurantData } = restaurant
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
        await updateDoc(restaurantDocRef, restaurantData);
        return restaurantId;  // Return the event ID to confirm the update
    } catch (e) {
        console.error("Error updating event: ", e);
        throw new Error("Failed to update event: " + e.message);
    }
}

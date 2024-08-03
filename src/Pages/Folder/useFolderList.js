import { useState, useEffect, useCallback } from "react"
import { useDisclosure } from '@chakra-ui/react';
import { 
    useRecoilValueLoadable,
    useRecoilRefresher_UNSTABLE
} from "recoil";
import { folderListState } from "./state";
import { restaurantListState } from "../Home/state";
import { addFolder } from "../../db"

export const useFolderList = () => {
    const defaultFolderData = {
        name: '',
        description: '',
    }

    const [folders, setFolders] = useState([]);
    const [newFolder, setNewFolder] = useState(defaultFolderData)
    const [isLoadingFolders, setIsLoadingFolders] = useState(true)
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();

    const onSyncRestaurants = useRecoilRefresher_UNSTABLE(restaurantListState);
    const onSyncFolders = useRecoilRefresher_UNSTABLE(folderListState)

    const onSync = useCallback(() => {
        onSyncRestaurants()
        onSyncFolders()
    }, [onSyncRestaurants, onSyncFolders])

    const handleAddFolder = async (newFolder) => {
        // setIsGlobalLoading(true)
        setIsLoadingFolders(true);

        try {
            await addFolder(newFolder)
            onSync()
        } catch (err) {
            console.log(err)
        } finally {
            setNewFolder(defaultFolderData)
            setIsLoadingFolders(false)
            // setIsGlobalLoading(false)
        }
        
        onAddModalClose();
    }

    const folderListLoadable = useRecoilValueLoadable(folderListState);
    useEffect(() => {
        if (folderListLoadable.state === "loading") {
            setIsLoadingFolders(true);
        } else if (folderListLoadable.state === "hasValue") {
            setFolders(folderListLoadable.contents)
            setIsLoadingFolders(false);
        } else if (folderListLoadable.state === "hasError") {
            setFolders([]);
            setIsLoadingFolders(false);
        }
    }, [folderListLoadable.contents, folderListLoadable.state]);

    return {
        folders,
        isLoadingFolders,
        isAddModalOpen,
        onAddModalOpen,
        onAddModalClose,
        newFolder, 
        setNewFolder,
        handleAddFolder
    }
}
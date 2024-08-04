import { useState, useEffect, useCallback, useMemo } from "react"
import { useDisclosure } from '@chakra-ui/react';
import { 
    useRecoilValueLoadable,
    useRecoilRefresher_UNSTABLE
} from "recoil";
import { folderListState } from "./state";
import { restaurantListState } from "../Home/state";
import { addFolder, updateFolder, deleteFolder } from "../../db"

export const useFolderList = () => {
    const defaultFolderData = useMemo(() => ({
        name: '',
        description: '',
    }), [])

    const [folders, setFolders] = useState([]);
    const [folderToBeDeleted, setFolderToBeDeleted] = useState(null)
    const [newFolder, setNewFolder] = useState(defaultFolderData)
    const [isLoadingFolders, setIsLoadingFolders] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
    
    const onSyncRestaurants = useRecoilRefresher_UNSTABLE(restaurantListState);
    const onSyncFolders = useRecoilRefresher_UNSTABLE(folderListState)

    const onSync = useCallback(() => {
        onSyncRestaurants()
        onSyncFolders()
    }, [onSyncRestaurants, onSyncFolders])

    const onClickEditFolder = useCallback((folder) => {
        setNewFolder(folder);
        onEditModalOpen();
    }, [onEditModalOpen])

    const onClickDeleteFolder = useCallback((folder) => {
        setFolderToBeDeleted(folder)
        onDeleteModalOpen()
    }, [onDeleteModalOpen])

    const handleAddFolder = async (newFolder) => {
        try {
            await addFolder(newFolder)
        } catch (err) {
            console.log(err)
        } finally {
            setNewFolder(defaultFolderData)
            onSync()
        }
        
        onAddModalClose();
    }

    const handleEditFolder = useCallback(async (folder) => {
        try {
            await updateFolder(folder)
        } catch (err) {
            console.log(err)
        } finally {
            setNewFolder(defaultFolderData)
            onSync()
        }
        
        onAddModalClose();
        onEditModalClose()
    }, [defaultFolderData, onAddModalClose, onEditModalClose, onSync])

    const handleDeleteFolder = useCallback(async (folder) => {
        setIsDeleting(true)

        try {
            await deleteFolder(folder)
            setIsDeleting(false)
        } catch (err) {
            console.log(err)
        } finally {
            onDeleteModalClose()
        }
        
        onSync()

    }, [onDeleteModalClose, onSync])

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
        handleAddFolder,
        onClickEditFolder,
        handleEditFolder,
        onClickDeleteFolder,
        handleDeleteFolder,
        isEditModalOpen,
        onEditModalClose,
        isDeleteModalOpen,
        onDeleteModalClose,
        folderToBeDeleted,
        isDeleting
    }
}
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { FolderPage } from './Pages/Folder';
import { useAuth } from './context/AuthContext';

export const AppRoutes = () => {
    const { currentUser } = useAuth();
    
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/home" replace />} />
            <Route 
                path="/home" 
                element={currentUser ? <Home /> : <Navigate to="/login" replace />} 
            />
            <Route 
                path="/folder" 
                element={currentUser ? <FolderPage /> : <Navigate to="/login" replace />} 
            />
        </Routes>
    );
}
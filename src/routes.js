import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { useAuth } from './context/AuthContext';

export const AppRoutes = () => {
    const { currentUser } = useAuth();
    
    return (
        <Routes>
            <Route 
                path="/" 
                element={currentUser ? <Home /> : <Navigate to="/login" replace />} 
            />
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    const handleNavigateToDashboard = () => {
        navigate('/dashboard')
    }

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={handleNavigateToDashboard}>Go to Dashboard</button>
        </div>
    );
};

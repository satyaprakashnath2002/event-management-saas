import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ children, isAdminRequired = false }) => {
    const user = AuthService.getCurrentUser();
    const location = useLocation(); // To remember where the user was going

    if (!user) {
        // Redirect to login but save the current location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (isAdminRequired && user.role !== 'ADMIN') {
        // You can keep the alert, though many modern apps use a "Toast" 
        // or a dedicated 'Unauthorized' page.
        console.warn("Unauthorized access attempt to:", location.pathname);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
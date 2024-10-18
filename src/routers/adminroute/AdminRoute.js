import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import Loading from '../../shared/loading/Loading';

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading />;  // Show a loading indicator while fetching user details
    }

    if (user && isAdmin) {
        return children;  // Allow access if the user is an admin
    }

    return <Navigate to="/login" state={{ from: location }} replace />;  // Redirect to login if not an admin
};

export default AdminRoute;
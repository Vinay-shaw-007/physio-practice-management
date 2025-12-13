import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { UserRole } from '../../types';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
    const location = useLocation();
    
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === UserRole.DOCTOR) {
            return <Navigate to="/dashboard" replace />;
        } else if (user.role === UserRole.PATIENT) {
            return <Navigate to="/patient/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
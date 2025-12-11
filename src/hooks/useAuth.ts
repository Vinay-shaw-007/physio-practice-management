import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { loginFailure, loginSuccess, logout } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/store';

// Custom hook for auth actions
export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(logout());

            // Redirect to login
            navigate('/login', {replace: true});
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleLogin = async (credentials: { email: string; password: string }) => {
        try {
            const response = await authService.login(credentials);
            dispatch(loginSuccess(response));
            return response;
        } catch (error) {
            dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
            throw error;
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        hasRole: (role: string) => user?.role === role,
    };
};
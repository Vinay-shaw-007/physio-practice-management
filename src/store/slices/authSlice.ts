import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

// Keys for localStorage
const AUTH_TOKEN_KEY = 'auth_token';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: localStorage.getItem(AUTH_TOKEN_KEY),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: state => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;

            // Store token in localStorage
            localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;

            // Clear localStorage
            localStorage.removeItem(AUTH_TOKEN_KEY);
        },
        clearError: state => {
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;

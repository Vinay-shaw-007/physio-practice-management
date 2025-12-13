import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import appointmentReducer from './slices/appointmentSlice';
import authReducer from './slices/authSlice';
import availabilityReducer from './slices/availabilitySlice';
import serviceReducer from './slices/serviceSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appointments: appointmentReducer,
        services: serviceReducer,
        availability: availabilityReducer,
        // Add more reducers here
    },
    middleware: getDefaultMiddleware =>
        // getDefaultMiddleware({
        //     serializableCheck: {
        //         // Ignore these action types
        //         ignoredActions: ['persist/PERSIST', 'auth/loginSuccess', 'auth/loginStart'],
        //         // Ignore these field paths in all actions
        //         ignoredActionPaths: [
        //             'meta.arg',
        //             'payload.date',
        //             'payload.user.createdAt',
        //             'payload.user.updatedAt',
        //             'payload.services',  // Ignore services array in actions
        //         ],
        //         // Ignore these paths in the state - bypass serialization check for Date objects
        //         ignoredPaths: [
        //             'appointments.filters.date',
        //             'availability.availabilitySlots',
        //             'auth.user.createdAt',
        //             'auth.user.updatedAt',
        //             'services.services',  // Bypass all Date checks in services array (createdAt, updatedAt)
        //         ],
        //     },
        // }),
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//export default store;

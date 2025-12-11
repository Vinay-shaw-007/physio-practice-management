// src/store/slices/availabilitySlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { availabilityService } from '../../services/availabilityService';
import { AvailabilitySlot, Unavailability } from '../../types';

interface AvailabilityState {
    availabilitySlots: AvailabilitySlot[];
    unavailability: Unavailability[];
    loading: boolean;
    error: string | null;
}

const initialState: AvailabilityState = {
    availabilitySlots: [
        {
            id: '1',
            doctorId: '1',
            dayOfWeek: 1, // Monday
            startTime: '09:00',
            endTime: '12:00',
            isRecurring: true,
            slotDuration: 30,
            maxAppointmentsPerSlot: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            doctorId: '1',
            dayOfWeek: 1, // Monday
            startTime: '14:00',
            endTime: '18:00',
            isRecurring: true,
            slotDuration: 30,
            maxAppointmentsPerSlot: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '3',
            doctorId: '1',
            dayOfWeek: 2, // Tuesday
            startTime: '10:00',
            endTime: '17:00',
            isRecurring: true,
            slotDuration: 60,
            maxAppointmentsPerSlot: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    unavailability: [
        {
            id: '1',
            doctorId: '1',
            title: 'Vacation',
            startDate: new Date('2024-12-25'),
            endDate: new Date('2024-12-31'),
            reason: 'Christmas holidays',
            isAllDay: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    loading: false,
    error: null,
};

// Async thunks
export const fetchAvailabilitySlots = createAsyncThunk(
    'availability/fetchSlots',
    async (doctorId: string) => {
        const response = await availabilityService.getAvailabilitySlots(doctorId);
        return response;
    }
);

export const fetchUnavailability = createAsyncThunk(
    'availability/fetchUnavailability',
    async (doctorId: string) => {
        const response = await availabilityService.getUnavailability(doctorId);
        return response;
    }
);

export const createAvailabilitySlot = createAsyncThunk(
    'availability/createSlot',
    async (slotData: Omit<AvailabilitySlot, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await availabilityService.createAvailabilitySlot(slotData);
        return response;
    }
);

export const updateAvailabilitySlot = createAsyncThunk(
    'availability/updateSlot',
    async ({ id, updates }: { id: string; updates: Partial<AvailabilitySlot> }) => {
        const response = await availabilityService.updateAvailabilitySlot(id, updates);
        return response;
    }
);

export const deleteAvailabilitySlot = createAsyncThunk(
    'availability/deleteSlot',
    async (id: string) => {
        await availabilityService.deleteAvailabilitySlot(id);
        return id;
    }
);

export const createUnavailability = createAsyncThunk(
    'availability/createUnavailability',
    async (itemData: Omit<Unavailability, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await availabilityService.createUnavailability(itemData);
        return response;
    }
);

export const deleteUnavailability = createAsyncThunk(
    'availability/deleteUnavailability',
    async (id: string) => {
        await availabilityService.deleteUnavailability(id);
        return id;
    }
);

const availabilitySlice = createSlice({
    name: 'availability',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Availability Slots
            .addCase(fetchAvailabilitySlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailabilitySlots.fulfilled, (state, action) => {
                state.loading = false;
                state.availabilitySlots = action.payload;
            })
            .addCase(fetchAvailabilitySlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch availability slots';
            })

            // Fetch Unavailability
            .addCase(fetchUnavailability.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUnavailability.fulfilled, (state, action) => {
                state.loading = false;
                state.unavailability = action.payload;
            })
            .addCase(fetchUnavailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch unavailability';
            })

            // Create Availability Slot
            .addCase(createAvailabilitySlot.fulfilled, (state, action) => {
                state.availabilitySlots.push(action.payload);
            })

            // Update Availability Slot
            .addCase(updateAvailabilitySlot.fulfilled, (state, action) => {
                const index = state.availabilitySlots.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.availabilitySlots[index] = action.payload;
                }
            })

            // Delete Availability Slot
            .addCase(deleteAvailabilitySlot.fulfilled, (state, action) => {
                state.availabilitySlots = state.availabilitySlots.filter(s => s.id !== action.payload);
            })

            // Create Unavailability
            .addCase(createUnavailability.fulfilled, (state, action) => {
                state.unavailability.push(action.payload);
            })

            // Delete Unavailability
            .addCase(deleteUnavailability.fulfilled, (state, action) => {
                state.unavailability = state.unavailability.filter(u => u.id !== action.payload);
            })
    },
});

export const { clearError } = availabilitySlice.actions;
export default availabilitySlice.reducer;
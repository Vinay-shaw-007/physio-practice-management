import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, AppointmentStatus } from '../../types';

interface AppointmentState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: AppointmentStatus | 'ALL';
    date: Date | null;
    search: string;
  };
}

const initialState: AppointmentState = {
  appointments: [],
  filteredAppointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  filters: {
    status: 'ALL',
    date: null,
    search: '',
  },
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.filteredAppointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.unshift(action.payload);
      state.filteredAppointments.unshift(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (appt) => appt.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
        state.filteredAppointments[index] = action.payload;
      }
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AppointmentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    filterAppointments: (state) => {
      state.filteredAppointments = state.appointments.filter((appt) => {
        // Filter by status
        if (state.filters.status !== 'ALL' && appt.status !== state.filters.status) {
          return false;
        }
        
        // Filter by date
        if (state.filters.date) {
          const appointmentDate = new Date(appt.date).toDateString();
          const filterDate = new Date(state.filters.date).toDateString();
          if (appointmentDate !== filterDate) {
            return false;
          }
        }
        
        return true;
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  setSelectedAppointment,
  setFilters,
  filterAppointments,
  setLoading,
  setError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
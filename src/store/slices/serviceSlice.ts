// src/store/slices/serviceSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { serviceService } from '../../services/serviceConfigurationService';
import { Service, ServiceType } from '../../types';

interface ServiceState {
  services: Service[];
  filteredServices: Service[];
  selectedServices: string[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    inactive: number;
    byType: {
      [ServiceType.CLINIC_VISIT]: 0,
      [ServiceType.HOME_VISIT]: 0,
      [ServiceType.VIDEO_CONSULT]: 0,
    },
    averagePrice: number;
    averageDuration: number;
  };
}

const initialState: ServiceState = {
  services: [
    {
      id: '1',
      name: 'Clinic Consultation',
      description: 'In-person consultation at the clinic',
      duration: 30,
      price: 600,
      type: ServiceType.CLINIC_VISIT,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Home Visit',
      description: 'Physiotherapy session at patient\'s home',
      duration: 60,
      price: 1200,
      type: ServiceType.HOME_VISIT,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Video Consultation',
      description: 'Remote consultation via video call',
      duration: 30,
      price: 800,
      type: ServiceType.VIDEO_CONSULT,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ],
  filteredServices: [],
  selectedServices: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    byType: {
      [ServiceType.CLINIC_VISIT]: 0,
      [ServiceType.HOME_VISIT]: 0,
      [ServiceType.VIDEO_CONSULT]: 0,
    },
    averagePrice: 0,
    averageDuration: 0,
  },
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params: { doctorId?: string; isActive?: boolean; type?: ServiceType, search?: string }) => {
    const response = await serviceService.getServices(params);
    return response;
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await serviceService.createService(serviceData);
    return response;
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, updates }: { id: string; updates: Partial<Service> }) => {
    const response = await serviceService.updateService(id, updates);
    return response;
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: string) => {
    await serviceService.deleteService(id);
    return id;
  }
);

export const toggleServiceStatus = createAsyncThunk(
  'services/toggleStatus',
  async (id: string) => {
    const response = await serviceService.toggleServiceStatus(id, initialState.services);
    return response;
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedServices: (state, action: PayloadAction<string[]>) => {
      state.selectedServices = action.payload;
    },
    filterServices: (state, action: PayloadAction<Service[] | null>) => {
      // let filtered = state.services;

      // if (action.payload.searchTerm) {
      //   const term = action.payload.searchTerm.toLowerCase();
      //   filtered = filtered.filter(service =>
      //     service.name.toLowerCase().includes(term) ||
      //     service.description.toLowerCase().includes(term)
      //   );
      // }

      // if (action.payload.type && action.payload.type !== 'ALL') {
      //   filtered = filtered.filter(service => service.type === action.payload.type);
      // }

      state.filteredServices = action.payload as Service[];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
        state.filteredServices = action.payload;

        // Calculate stats
        const active = action.payload.filter(s => s.isActive).length;
        const totalPrice = action.payload.reduce((sum, s) => sum + s.price, 0);
        const totalDuration = action.payload.reduce((sum, s) => sum + s.duration, 0);

        state.stats = {
          ...state.stats,
          total: action.payload.length,
          active,
          inactive: action.payload.length - active,
          averagePrice: action.payload.length > 0 ? totalPrice / action.payload.length : 0,
          averageDuration: action.payload.length > 0 ? totalDuration / action.payload.length : 0,
        };
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })

      // Create Service
      .addCase(createService.fulfilled, (state, action) => {
        state.services.unshift(action.payload);
        state.filteredServices.unshift(action.payload);
      })

      // Update Service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
          state.filteredServices[index] = action.payload;
        }
      })

      // Delete Service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload);
        state.filteredServices = state.filteredServices.filter(s => s.id !== action.payload);
      })

      // Toggle Status
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
          state.filteredServices[index] = action.payload;
        }
      })
  },
});

export const { setSelectedServices, filterServices, clearError } = serviceSlice.actions;
export default serviceSlice.reducer;
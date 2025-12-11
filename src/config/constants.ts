// Application constants
export const APP_CONFIG = {
  name: 'PhysioPro',
  version: '1.0.0',
  description: 'Physiotherapy Practice Management System',
};

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Routing Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  PATIENTS: '/patients',
  SETTINGS: '/settings',
  AVAILABILITY: '/availability',
  SERVICES: '/services',
};

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'dd/MM/yyyy',
  DISPLAY_TIME: 'hh:mm a',
  DISPLAY_DATETIME: 'dd/MM/yyyy hh:mm a',
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50],
};
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/constants';
import { logout } from '../store/slices/authSlice';
import { store } from '../store/store';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
            headers: API_CONFIG.headers,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor for adding auth token
        this.client.interceptors.request.use(
            config => {
                const token = localStorage.getItem('auth_token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            response => response,
            error => {
                const originalRequest = error.config;

                if (error.response?.status === 401) {
                    // Don't retry if already tried
                    if (originalRequest?.headers['X-Retry-Attempt']) {
                        return Promise.reject(error);
                    }

                    // Clear auth data
                    localStorage.removeItem('auth_token');

                    // Dispatch logout action to clear Redux state
                    store.dispatch(logout());

                    // Prevent redirect loops
                    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                        window.location.href = '/login';
                    }
                }

                // Handle other errors
                if (error.response?.status === 403) {
                    console.error('Access forbidden');
                }

                if (error.response?.status === 500) {
                    console.error('Server error');
                }
                return Promise.reject(error);
            }
        );
    }

    // CRUD methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }
    // Add methods for file uploads
    async upload<T>(url: string, file: File, fieldName = 'file'): Promise<T> {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await this.client.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
}

export const apiService = new ApiService();

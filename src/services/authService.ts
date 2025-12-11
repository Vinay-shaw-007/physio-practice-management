import { User, UserRole } from '../types';
import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

class AuthService {
  async validateToken(): Promise<{ user: User; token: string }> {
    // This endpoint should validate the token and return fresh user data
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No token found');
    }

    try {
      // Backend validates token and returns user data
      const user = await apiService.get<User>('/auth/validate');
      return { user, token };
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
      }
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.token);
      
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData: Partial<User> & { password: string }): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/register', userData);
      
      localStorage.setItem('auth_token', response.token);
      
      return response;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('User already exists');
      }
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // Optional: Call backend to invalidate token
      await apiService.post('/auth/logout');
    } catch (error) {
      // Silent fail - frontend logout anyway
      console.log('Backend logout failed, proceeding with frontend logout');
    } finally {
      // Always clear frontend storage
      localStorage.removeItem('auth_token');
    }
  }

  // Helper to get current token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Check if user has specific role
  hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  // Check if user is authenticated based on token existence
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
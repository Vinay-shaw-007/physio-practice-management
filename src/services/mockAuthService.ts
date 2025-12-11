import { User, UserRole } from '../types';
import { LoginResponse } from './authService';

// Mock database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'doctor@example.com',
    name: 'Dr. Sarah Johnson',
    role: UserRole.DOCTOR,
    phone: '+1 234 567 8900',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'patient@example.com',
    name: 'John Doe',
    role: UserRole.PATIENT,
    phone: '+1 987 654 3210',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_TOKEN = 'mock-jwt-token-for-development';

class MockAuthService {
  async validateToken(): Promise<{ user: User; token: string }> {
    const token = localStorage.getItem('auth_token');
    
    if (!token || token !== MOCK_TOKEN) {
      throw new Error('Invalid token');
    }
    
    // In real app, this would decode JWT and fetch user from DB
    const user = mockUsers[0]; // Default to doctor for demo
    
    return { user, token };
  }

  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: MOCK_TOKEN,
    };
  }

  async logout(): Promise<void> {
    // Just clear localStorage
    localStorage.removeItem('auth_token');
  }
}

export const mockAuthService = new MockAuthService();

// For development, replace authService with mockAuthService
// In production, use the real authService
// export const authService = import.meta.env.VITE_ENV === 'development'
//   ? mockAuthService
//   : // Import the real service
//     (await import('./authService')).authService;
export const authService = mockAuthService;
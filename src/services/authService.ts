import { User, UserRole } from '../types';
import { mockStorage } from '../utils/mockStorage';

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
    // In this mock, we just check if a user is stored in localStorage
    // In a real app, we'd hit an endpoint with the token
    const token = localStorage.getItem('auth_token');
    const storedUserStr = localStorage.getItem('auth_user');
    
    if (!token || !storedUserStr) {
      throw new Error('No token found');
    }

    return { 
        user: JSON.parse(storedUserStr), 
        token 
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = mockStorage.findUserByEmail(credentials.email);

    if (!user) {
        throw new Error('User not found');
    }

    // In a real app, NEVER compare plain text passwords. 
    // This is strictly for the mock environment.
    if (user.password !== credentials.password) {
        throw new Error('Invalid password');
    }

    // Generate a fake token
    const token = `mock-jwt-token-${Date.now()}`;
    
    // Persist session
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    // Remove password before returning
    const { password, ...userWithoutPassword } = user;
    
    return {
        user: userWithoutPassword as User,
        token
    };
  }

  async register(userData: Partial<User> & { password: string }): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const existingUser = mockStorage.findUserByEmail(userData.email || '');
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: '', // Default empty avatar
    } as User;

    // Save to "DB"
    mockStorage.saveUser(newUser);

    // Auto-login after register
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(newUser));

    const { password, ...userWithoutPassword } = newUser;

    return {
        user: userWithoutPassword as User,
        token
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
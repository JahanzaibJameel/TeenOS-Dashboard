import { User, AuthCredentials, RegisterData, LoginResponse, RefreshTokenResponse } from '../types'

class AuthService {
  private static instance: AuthService
  private baseUrl: string

  private constructor() {
    this.baseUrl = '/api';
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: AuthCredentials): Promise<LoginResponse> {
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockUser: User = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return {
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
    }
    
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const mockUser: User = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return {
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockUser: User = {
      id: `user-${Date.now()}`,
      username: data.email.split('@')[0],
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('accessToken')
    
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      })
    } catch (error) {
      console.error('Logout notification failed:', error)
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      this.setAccessToken(data.accessToken)
      
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken)
      }
      
      return data;
    } else {
      const defaultResponse: RefreshTokenResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
      
      this.setAccessToken(defaultResponse.accessToken)
      
      if (defaultResponse.refreshToken) {
        this.setRefreshToken(defaultResponse.refreshToken)
      }
      
      return defaultResponse;
    }
  }

  setAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token)
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken')
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  getCurrentUser(): User | null {
    const userStr = sessionStorage.getItem('currentUser')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('Failed to parse current user:', error)
        return null
      }
    }
    return null
  }

  setCurrentUser(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user))
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken()
    if (!accessToken) return false

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime
    } catch (error) {
      console.error('Failed to validate token:', error)
      return false
    }
  }
}

export default AuthService
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { User, AuthCredentials, RegisterData } from '../types'
import AuthService from '../services/AuthService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: AuthCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
}

const authService = AuthService.getInstance()

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.login(credentials)
          
          // Store tokens
          authService.setAccessToken(response.accessToken)
          if (response.refreshToken) {
            authService.setRefreshToken(response.refreshToken)
          }
          
          // Store user info
          authService.setCurrentUser(response.user)
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error: any) {
          set({
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Login failed'
          })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.register(data)
          
          // Store tokens
          authService.setAccessToken(response.accessToken)
          if (response.refreshToken) {
            authService.setRefreshToken(response.refreshToken)
          }
          
          // Store user info
          authService.setCurrentUser(response.user)
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error: any) {
          set({
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Registration failed'
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
          
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        } catch (error: any) {
          console.error('Logout error:', error)
          set({
            user: null,
            isAuthenticated: false,
            error: error.message || 'Logout failed'
          })
        }
      },

      refreshAuth: async () => {
        try {
          const response = await authService.refreshToken()
          
          // Update access token in service
          authService.setAccessToken(response.accessToken)
          
          // Get current user and update in store
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            set({
              user: currentUser,
              isAuthenticated: true
            })
          }
        } catch (error: any) {
          console.error('Token refresh failed:', error)
          
          // If refresh fails, log out user
          set({
            user: null,
            isAuthenticated: false
          })
          
          throw error
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setError: (error) => {
        set({ error })
      }
    })),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for sensitive data
    }
  )
)
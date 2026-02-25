import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore } from '../store/authStore'
import AuthService from '../services/AuthService'

interface AuthContextProps {
  isAuthenticated: boolean
  user: any
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
  } = useAuthStore()

  const login = async (email: string, password: string) => {
    await storeLogin({ email, password })
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    await storeRegister({ email, password, firstName, lastName })
  }

  const logout = async () => {
    await storeLogout()
  }

  // Check authentication status on app load
  useEffect(() => {
    const authService = AuthService.getInstance()
    if (!user && !isLoading && !isAuthenticated) {
      // Attempt to refresh auth if we have a stored refresh token
      const refreshToken = authService.getRefreshToken()
      if (refreshToken && authService.isAuthenticated()) {
        storeLogin({ email: '', password: '' }).catch(() => {
          // If refresh fails, user remains logged out
        })
      }
    }
  }, [user, isLoading, isAuthenticated, storeLogin])

  const value = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
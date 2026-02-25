export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
}
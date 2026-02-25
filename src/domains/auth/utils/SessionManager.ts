import { useAuthStore } from '../store/authStore'
import AuthService from '../services/AuthService'

export class SessionManager {
  private static instance: SessionManager
  private authService: AuthService
  private refreshInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.authService = AuthService.getInstance()
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  /**
   * Initialize session management
   */
  init(): void {
    // Set up periodic checks for token expiration
    this.startTokenRefreshCheck()
    
    // Listen for storage events (in case of tabs)
    window.addEventListener('storage', this.handleStorageChange)
  }

  /**
   * Start checking for token refresh periodically
   */
  private startTokenRefreshCheck(): void {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }

    // Check every minute if token needs refresh
    this.refreshInterval = setInterval(async () => {
      this.checkAndRefreshToken()
    }, 60000) // Every minute
  }

  /**
   * Check if token needs refresh and refresh if needed
   */
  private async checkAndRefreshToken(): Promise<void> {
    try {
      const token = this.authService.getAccessToken()
      if (!token) return

      // Decode token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const timeUntilExpiration = payload.exp - currentTime
      
      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiration < 300) {
        await this.authService.refreshToken()
      }
    } catch (error) {
      console.error('Error checking token expiration:', error)
      // If refresh fails, log out the user
      useAuthStore.getState().logout().catch(console.error)
    }
  }

  /**
   * Handle storage changes (from other tabs)
   */
  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === 'refreshToken') {
      if (event.newValue === null) {
        // Refresh token was removed (logout in another tab)
        useAuthStore.getState().setUser(null)
        useAuthStore.getState().setError(null)
      } else if (event.oldValue === null && event.newValue !== null) {
        // New refresh token (login in another tab)
        // In a real app, we'd handle this scenario
      }
    }
  }

  /**
   * Clean up session management
   */
  destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
    
    window.removeEventListener('storage', this.handleStorageChange)
  }

  /**
   * Force refresh the token
   */
  async forceRefreshToken(): Promise<void> {
    try {
      await this.authService.refreshToken()
    } catch (error) {
      console.error('Failed to refresh token:', error)
      throw error
    }
  }

  /**
   * Check if session is still valid
   */
  isSessionValid(): boolean {
    return this.authService.isAuthenticated()
  }
}

export const sessionManager = SessionManager.getInstance()
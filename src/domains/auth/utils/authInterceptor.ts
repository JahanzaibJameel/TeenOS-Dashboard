import { useAuthStore } from '../store/authStore'
import AuthService from '../services/AuthService'

export class AuthInterceptor {
  private authService: AuthService
  private isRefreshing = false
  private failedQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void }> = []

  constructor() {
    this.authService = AuthService.getInstance()
  }

  async addAuthHeaders(headers: Headers): Promise<Headers> {
    const token = this.authService.getAccessToken()
    
    if (token) {
      headers.append('Authorization', `Bearer ${token}`)
    }
    
    return headers
  }

  async authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const headers = new Headers(init?.headers)
    await this.addAuthHeaders(headers)
    
    const config = { ...init, headers }
    let response = await fetch(input, config)
    
    if (response.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        
        try {
          await this.authService.refreshToken()
          const newHeaders = new Headers(init?.headers)
          await this.addAuthHeaders(newHeaders)
          response = await fetch(input, { ...init, headers: newHeaders })
          this.processQueue(null)
        } catch (refreshError) {
          this.processQueue(refreshError)
          useAuthStore.getState().logout().catch(console.error)
          throw refreshError
        } finally {
          this.isRefreshing = false
        }
      }
    }
    
    return response
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(null)
      }
    })
    
    this.failedQueue = []
  }
}

export const authInterceptor = new AuthInterceptor()
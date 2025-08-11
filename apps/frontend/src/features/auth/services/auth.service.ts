/*
    Service layer: Contains business logic
    Call API, handle data, save tokens, cleanup...
*/
import { authApi } from '../api'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types'
import { TOKEN_CONSTANTS } from '@/core/constants/tokens'
import { cookieUtils } from '@/core/utils/cookie.utils'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await authApi.login(credentials)
    this.saveTokens(data)
    return data
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const data = await authApi.register(credentials)
    this.saveTokens(data)
    return data
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout()
    } finally {
      this.clearTokens()
    }
  }

  async getProfile(): Promise<any> {
    return authApi.getProfile()
  }

  async updateProfile(payload: any): Promise<any> {
    return authApi.updateProfile(payload)
  }

  async refresh(): Promise<AuthResponse> {
    const data = await authApi.refresh()
    this.saveTokens(data)
    return data
  }

  private saveTokens(data: AuthResponse) {
    // Save to cookies for server-side access
    cookieUtils.setCookie(TOKEN_CONSTANTS.ACCESS_TOKEN, data.accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    if (data.refreshToken) {
      cookieUtils.setCookie(TOKEN_CONSTANTS.REFRESH_TOKEN, data.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }
    
    // Also save to localStorage for client-side access
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_CONSTANTS.ACCESS_TOKEN, data.accessToken)
      if (data.refreshToken) {
        localStorage.setItem(TOKEN_CONSTANTS.REFRESH_TOKEN, data.refreshToken)
      }
    }
  }

  private clearTokens() {
    // Clear cookies
    cookieUtils.deleteCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
    cookieUtils.deleteCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_CONSTANTS.ACCESS_TOKEN)
      localStorage.removeItem(TOKEN_CONSTANTS.REFRESH_TOKEN)
    }
  }
}

export const authService = new AuthService()

/*
    Service layer: Contains business logic
    Call API, handle data, save tokens, cleanup...
*/
import { authApi } from '../api'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types'
import { AUTH_CONSTANTS } from '../constants'

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
    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, data.accessToken)
    if (data.refreshToken) {
      localStorage.setItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY, data.refreshToken)
    }
  }

  private clearTokens() {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
    localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
  }
}

export const authService = new AuthService()

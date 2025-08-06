import { authApi } from '../api'
import { AUTH_CONSTANTS } from '../constants'
import { generateAvatar } from '../utils'
import type { User, AuthTokens, LoginCredentials, RegisterCredentials } from '../types'

class AuthService {
  // Business logic for authentication
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await authApi.login(credentials)

    // Add avatar if not present
    if (!response.user.avatar) {
      response.user.avatar = generateAvatar(response.user.firstName, response.user.lastName)
    }

    // Add default department if not present
    if (!response.user.department) {
      response.user.department = 'Engineering'
    }

    // Store tokens and user
    this.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    })
    this.setUser(response.user)

    return response.user
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await authApi.register(credentials)

    // Add avatar if not present
    if (!response.user.avatar) {
      response.user.avatar = generateAvatar(response.user.firstName, response.user.lastName)
    }

    // Add default department if not present
    if (!response.user.department) {
      response.user.department = 'Engineering'
    }

    // Store tokens and user
    this.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    })
    this.setUser(response.user)

    return response.user
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout()
    } finally {
      // Always clear local storage even if API call fails
      this.clearAuth()
    }
  }

  // Token management
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY, tokens.refreshToken)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
  }

  // User management
  setUser(user: User): void {
    localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(user))
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(AUTH_CONSTANTS.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  // Auth state checks
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getUser()
  }

  clearAuth(): void {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
    localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
    localStorage.removeItem(AUTH_CONSTANTS.USER_KEY)
  }
}

export const authService = new AuthService()
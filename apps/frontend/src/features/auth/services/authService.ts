import { apiService } from "@/shared/services/api"
import { User } from "../types/auth.types"

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.login({ email, password })
      return response
    } catch (error) {
      throw new Error("Login failed")
    }
  }

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.register({ name, email, password })
      return response
    } catch (error) {
      throw new Error("Registration failed")
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout()
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  setAuthToken(token: string): void {
    localStorage.setItem("authToken", token)
  }

  getAuthToken(): string | null {
    return localStorage.getItem("authToken")
  }

  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user))
  }

  getUser(): User | null {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }

  clearAuth(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }
}

export const authService = new AuthService() 
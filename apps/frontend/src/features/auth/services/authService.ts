import { apiService } from "@/shared/services/api"
import { User, AuthApiResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types"

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.login({ email, password }) as AuthApiResponse
      
      // Transform API response to match frontend expectations
      const user: User = {
        ...response.user,
        avatar: this.generateAvatar(response.user.firstName, response.user.lastName),
        department: "Engineering" // Default department for now
      }
      
      return {
        user,
        token: response.accessToken // Use accessToken from API
      }
    } catch (error: any) {
      console.error("Login API error:", error)
      // Pass through the actual error message from API
      throw new Error(error.message || "Login failed")
    }
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.register({ firstName, lastName, email, password }) as AuthApiResponse
      
      // Transform API response to match frontend expectations
      const user: User = {
        ...response.user,
        avatar: this.generateAvatar(response.user.firstName, response.user.lastName),
        department: "Engineering" // Default department for now
      }
      
      return {
        user,
        token: response.accessToken // Use accessToken from API
      }
    } catch (error: any) {
      console.error("Registration API error:", error)
      // Pass through the actual error message from API
      throw new Error(error.message || "Registration failed")
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout()
      this.clearAuth()
    } catch (error) {
      console.error("Logout error:", error)
      // Clear auth even if API call fails
      this.clearAuth()
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

  // Helper method to generate avatar URL based on name
  private generateAvatar(firstName: string, lastName: string): string {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random&color=fff&size=200`
  }
}

export const authService = new AuthService() 
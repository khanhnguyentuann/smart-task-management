import { API_ROUTES } from "@/core/constants/routes"
import { AUTH_CONSTANTS } from "@/features/auth/constants/auth.constants"

class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  }

  // Check if token is about to expire (within 5 minutes)
  private isTokenExpiringSoon(): boolean {
    const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY)
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp * 1000 // Convert to milliseconds
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000
      
      return (exp - now) < fiveMinutes
    } catch {
      return false
    }
  }

  // Proactively refresh token if needed
  private async refreshTokenIfNeeded(): Promise<void> {
    if (this.isTokenExpiringSoon()) {
      const refreshToken = localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
      if (refreshToken) {
        try {
          const response = await this.refreshToken(refreshToken)
          const newToken = (response as any).accessToken || (response as any).token
          if (newToken) {
            localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, newToken)
          }
        } catch (error) {
          // If refresh fails, clear tokens
          localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
          localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
          throw error
        }
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Proactively refresh token if needed
    await this.refreshTokenIfNeeded()
    
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY)
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401) {
          const refreshToken = localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
          if (refreshToken) {
            try {
              const refreshResponse = await this.refreshToken(refreshToken)
              const newToken = (refreshResponse as any).accessToken || (refreshResponse as any).token
              if (newToken) {
                localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, newToken)
                // Retry the original request with new token
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`,
                }
                const retryResponse = await fetch(url, config)
                if (!retryResponse.ok) {
                  throw new Error(`HTTP error! status: ${retryResponse.status}`)
                }
                return await retryResponse.json()
              }
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
              localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
              window.location.href = '/login'
              throw new Error('Authentication expired. Please login again.')
            }
          } else {
            // No refresh token, redirect to login
            localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
            window.location.href = '/login'
            throw new Error('Authentication required. Please login.')
          }
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // If we can't parse JSON, use default message
        }
        throw new Error(errorMessage)
      }
      
      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request(API_ROUTES.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: { firstName: string; lastName: string; email: string; password: string }) {
    return this.request(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request(API_ROUTES.AUTH.LOGOUT, {
      method: "POST",
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request(API_ROUTES.AUTH.REFRESH, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }

  // Projects endpoints
  async getProjects() {
    return this.request(API_ROUTES.PROJECTS.LIST)
  }

  async createProject(projectData: any) {
    return this.request(API_ROUTES.PROJECTS.CREATE, {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  }

  async getProject(id: string) {
    return this.request(API_ROUTES.PROJECTS.DETAIL(id))
  }

  async updateProject(id: string, projectData: any) {
    return this.request(API_ROUTES.PROJECTS.UPDATE(id), {
      method: "PATCH",
      body: JSON.stringify(projectData),
    })
  }

  async getProjectTasks(projectId: string, params?: Record<string, string | number | boolean>) {
    const query = params
      ? "?" + new URLSearchParams(Object.entries(params).reduce((acc, [k, v]) => {
          acc[k] = String(v)
          return acc
        }, {} as Record<string, string>)).toString()
      : ""
    return this.request(`${API_ROUTES.PROJECTS.TASKS(projectId)}${query}`)
  }

  async createProjectTask(projectId: string, taskData: any) {
    return this.request(API_ROUTES.PROJECTS.TASKS(projectId), {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async searchProjects(query: string) {
    return this.request(`${API_ROUTES.PROJECTS.SEARCH}?q=${encodeURIComponent(query)}`)
  }

  async deleteProject(id: string) {
    return this.request(API_ROUTES.PROJECTS.DELETE(id), {
      method: "DELETE",
    })
  }

  // Tasks endpoints
  async getTasks(params?: Record<string, string | number | boolean>) {
    const query = params
      ? "?" + new URLSearchParams(Object.entries(params).reduce((acc, [k, v]) => {
          acc[k] = String(v)
          return acc
        }, {} as Record<string, string>)).toString()
      : ""
    return this.request(`${API_ROUTES.TASKS.LIST}${query}`)
  }

  async createTask(taskData: any) {
    return this.request(API_ROUTES.TASKS.CREATE, {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async getTask(id: string) {
    return this.request(API_ROUTES.TASKS.DETAIL(id))
  }

  async updateTask(id: string, taskData: any) {
    return this.request(API_ROUTES.TASKS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(taskData),
    })
  }

  async deleteTask(id: string) {
    return this.request(API_ROUTES.TASKS.DELETE(id), {
      method: "DELETE",
    })
  }

  // User endpoints
  async getUsers(search?: string) {
    const url = search ? `${API_ROUTES.USERS.LIST}?search=${encodeURIComponent(search)}` : API_ROUTES.USERS.LIST
    return this.request(url)
  }

  async getUserProfile() {
    return this.request(API_ROUTES.USERS.PROFILE)
  }

  async updateUserProfile(userData: any) {
    return this.request(API_ROUTES.USERS.UPDATE, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }
}

export const apiService = new ApiService() 
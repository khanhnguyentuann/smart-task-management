import { API_ROUTES } from "@/core/constants/routes"
import { AUTH_CONSTANTS } from "@/features/auth/constants/auth.constants"

class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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

  async searchProjects(query: string) {
    return this.request(`${API_ROUTES.PROJECTS.SEARCH}?q=${encodeURIComponent(query)}`)
  }

  async deleteProject(id: string) {
    return this.request(API_ROUTES.PROJECTS.DELETE(id), {
      method: "DELETE",
    })
  }

  // Tasks endpoints
  async getTasks() {
    return this.request(API_ROUTES.TASKS.LIST)
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
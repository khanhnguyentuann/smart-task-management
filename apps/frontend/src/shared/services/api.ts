import { API_ROUTES } from "@/core/constants/routes"
import { AUTH_CONSTANTS } from "@/features/auth/constants/auth.constants"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"

class ApiService {
  private baseURL: string
  private axiosInstance: AxiosInstance

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    })

    // Attach token + log requests
    this.axiosInstance.interceptors.request.use((config) => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY) : null
        if (token) {
          if (!config.headers) config.headers = new (axios.AxiosHeaders || (class {} as any))()
          // Normalize to plain object for compatibility
          const hdrs: Record<string, string> = typeof config.headers === 'object' ? (config.headers as any) : {}
          hdrs['Authorization'] = `Bearer ${token}`
          config.headers = hdrs as any
        }
        // eslint-disable-next-line no-console
        console.log('[API request]', { method: (config.method || 'GET').toUpperCase(), url: config.url })
      } catch {}
      return config
    })
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
    const isAuthEndpoint = endpoint.startsWith('/api/auth/')
    // Proactively refresh token if needed (skip for auth endpoints to avoid loops)
    if (!isAuthEndpoint) {
      await this.refreshTokenIfNeeded()
    }

    const method = (options.method || 'GET').toUpperCase()
    const axiosConfig: AxiosRequestConfig = {
      url: endpoint,
      method: method as AxiosRequestConfig['method'],
      headers: undefined,
      data: undefined,
    }
    // Build headers safely for Axios typing
    const builtHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (options.headers) {
      for (const [k, v] of Object.entries(options.headers)) {
        if (typeof v === 'string') builtHeaders[k] = v
      }
    }
    axiosConfig.headers = builtHeaders
    const rawBody = (options as any).body
    if (rawBody) {
      try {
        axiosConfig.data = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody
      } catch {
        axiosConfig.data = rawBody
      }
    }

    try {
      const res = await this.axiosInstance.request<T>(axiosConfig)
      // eslint-disable-next-line no-console
      console.log('[API response:ok]', { method, endpoint })
      return res.data as T
    } catch (err) {
      const error = err as AxiosError
      const status = error.response?.status
      // eslint-disable-next-line no-console
      console.warn('[API response:error]', { method, endpoint, status })

      if (status === 401) {
        // Auth endpoints: surface backend message
        if (isAuthEndpoint) {
          const authMsg = (error.response?.data as any)?.message || 'Unauthorized'
          throw new Error(authMsg)
        }

        // Non-auth endpoints: try refresh once then retry
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY) : null
        if (refreshToken) {
          try {
            const refreshRes = await this.axiosInstance.post(API_ROUTES.AUTH.REFRESH, { refreshToken })
            const newToken = (refreshRes.data as any)?.accessToken || (refreshRes.data as any)?.token
            if (newToken) {
              localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, newToken)
              const retryConfig: AxiosRequestConfig = {
                ...axiosConfig,
                headers: {
                  ...(axiosConfig.headers || {}),
                  Authorization: `Bearer ${newToken}`,
                },
              }
              // eslint-disable-next-line no-console
              console.log('[API retry after refresh]', { method, endpoint })
              const retryRes = await this.axiosInstance.request<T>(retryConfig)
              return retryRes.data as T
            }
          } catch (refreshError) {
            localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
            localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
            throw new Error('Authentication expired. Please login again.')
          }
        } else {
          localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
          throw new Error('Authentication required. Please login.')
        }
      }

      const fallbackMessage = (error.response?.data as any)?.message || error.message || 'Network error'
      // eslint-disable-next-line no-console
      console.error('[API error]', { method, endpoint, message: fallbackMessage })
      throw new Error(fallbackMessage)
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

  async removeProjectMember(projectId: string, memberId: string) {
    return this.request(API_ROUTES.PROJECTS.MEMBERS.REMOVE(projectId, memberId), {
      method: "DELETE",
    })
  }

  async addProjectMembers(projectId: string, memberIds: string[]) {
    return this.request(API_ROUTES.PROJECTS.MEMBERS.ADD(projectId), {
      method: "POST",
      body: JSON.stringify({ userIds: memberIds }),
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
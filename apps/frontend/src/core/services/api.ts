import { API_ROUTES } from "@/core/constants/routes"
import { AUTH_CONSTANTS } from "@/features/auth/constants/auth.constants"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"

class ApiService {
  private axiosInstance: AxiosInstance
  private isDev = process.env.NODE_ENV === 'development'

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    })

    // Attach token + log requests
    this.axiosInstance.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY) : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      if (this.isDev) {
        console.log('[API request]', { method: (config.method || 'GET').toUpperCase(), url: config.url })
      }
      return config
    })
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const method = (options.method || 'GET').toUpperCase()
    const isAuthEndpoint = endpoint.startsWith('/api/auth/')

    const axiosConfig: AxiosRequestConfig = {
      url: endpoint,
      method: method as AxiosRequestConfig['method'],
      data: options.body ? JSON.parse(options.body as string) : undefined,
    }

    try {
      const res = await this.axiosInstance.request<T>(axiosConfig)
      if (this.isDev) {
        console.log('[API response:ok]', { method, endpoint })
      }
      return res.data
    } catch (err) {
      const error = err as AxiosError
      const status = error.response?.status

      if (this.isDev) {
        console.warn('[API response:error]', { method, endpoint, status })
      }

      if (status === 401 && !isAuthEndpoint) {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY) : null
        if (refreshToken) {
          try {
            const refreshRes = await this.axiosInstance.post(API_ROUTES.AUTH.REFRESH, { refreshToken })
            const newToken = refreshRes.data?.accessToken || refreshRes.data?.token
            if (newToken) {
              localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, newToken)
              // Retry with new token
              axiosConfig.headers = { ...axiosConfig.headers, Authorization: `Bearer ${newToken}` }
              const retryRes = await this.axiosInstance.request<T>(axiosConfig)
              return retryRes.data
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

      const message = (error.response?.data as { message?: string } | undefined)?.message || error.message || 'Network error'
      if (this.isDev) {
        console.error('[API error]', { method, endpoint, message })
      }
      throw new Error(message)
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
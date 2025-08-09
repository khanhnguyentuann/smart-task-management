import { AUTH_CONSTANTS } from "@/features/auth/constants/auth.constants"
import { API_ROUTES } from "@/core/constants/routes"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"

// Base API Client - Just handle HTTP communication
class ApiClient {
    private axiosInstance: AxiosInstance
    private isDev = process.env.NODE_ENV === 'development'

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
            headers: { "Content-Type": "application/json" },
            withCredentials: false,
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor - Attach token
        this.axiosInstance.interceptors.request.use((config) => {
            const token = typeof window !== 'undefined'
                ? (localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY) || localStorage.getItem('accessToken'))
                : null

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            if (this.isDev) {
                console.log('[API request]', {
                    method: (config.method || 'GET').toUpperCase(),
                    url: config.url
                })
            }

            return config
        })

        // Response interceptor - Handle errors and refresh token
        this.axiosInstance.interceptors.response.use(
            (response) => {
                if (this.isDev) {
                    console.log('[API response:ok]', {
                        url: response.config.url,
                        status: response.status
                    })
                }
                return response
            },
            async (error: AxiosError) => {
                if (this.isDev) {
                    console.warn('[API response:error]', {
                        url: error.config?.url,
                        status: error.response?.status
                    })
                }

                // Handle 401 - Token expired
                if (error.response?.status === 401) {
                    const isAuthEndpoint = error.config?.url?.startsWith('/api/auth/')

                    if (!isAuthEndpoint) {
                        return this.handleTokenRefresh(error)
                    }
                }

                // Extract error message
                const message = (error.response?.data as any)?.message
                    || error.message
                    || 'Network error'

                return Promise.reject(new Error(message))
            }
        )
    }

    private async handleTokenRefresh(originalError: AxiosError) {
        const refreshToken = typeof window !== 'undefined'
            ? (localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY) || localStorage.getItem('refreshToken'))
            : null

        if (!refreshToken) {
            this.clearAuth()
            throw new Error('Authentication required. Please login.')
        }

        try {
            const { data } = await this.axiosInstance.post(
                API_ROUTES.AUTH.REFRESH,
                { refreshToken }
            )

            const newToken = data?.accessToken || data?.token

            if (newToken) {
                localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, newToken)

                // Retry original request with new token
                const originalRequest = originalError.config!
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return this.axiosInstance.request(originalRequest)
            }
        } catch (error) {
            this.clearAuth()
            throw new Error('Authentication expired. Please login again.')
        }
    }

    private clearAuth() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY)
            localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
        }
    }

    // Generic request method - Used by feature services
    async request<T = any>(
        endpoint: string,
        config: AxiosRequestConfig = {}
    ): Promise<T> {
        const axiosConfig: AxiosRequestConfig = {
            url: endpoint,
            ...config,
        }

        try {
            const response = await this.axiosInstance.request<T>(axiosConfig)
            const raw = response.data as any
            if (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) {
                return raw.data as T
            }
            return raw as T
        } catch (error) {
            // Error is handled in interceptor
            throw error
        }
    }


    get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>(url, { method: 'GET', ...config })
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>(url, {
            method: 'POST',
            data,
            ...config,
        })
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>(url, {
            method: 'PUT',
            data,
            ...config,
        })
    }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>(url, {
            method: 'PATCH',
            data,
            ...config,
        })
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>(url, { method: 'DELETE', ...config })
    }
}

// Export singleton instance
export const apiClient = new ApiClient()
export { ApiClient }
import { API_ROUTES } from "@/core/constants/routes"
import { TOKEN_CONSTANTS } from "@/core/constants/tokens"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"
import { cookieUtils } from "@/core/utils/cookie.utils"

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
            // Get token from cookies (primary) or localStorage (fallback)
            const token = typeof window !== 'undefined'
                ? (cookieUtils.getCookie(TOKEN_CONSTANTS.ACCESS_TOKEN) || localStorage.getItem(TOKEN_CONSTANTS.ACCESS_TOKEN))
                : null

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        })

        // Response interceptor - Handle errors and refresh token
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response
            },
            async (error: AxiosError) => {
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
            ? (cookieUtils.getCookie(TOKEN_CONSTANTS.REFRESH_TOKEN) || localStorage.getItem(TOKEN_CONSTANTS.REFRESH_TOKEN))
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
                // Save new token to both cookies and localStorage
                cookieUtils.setCookie(TOKEN_CONSTANTS.ACCESS_TOKEN, newToken, {
                    maxAge: 15 * 60 * 1000, // 15 minutes
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                })
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem(TOKEN_CONSTANTS.ACCESS_TOKEN, newToken)
                }

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
        // Clear cookies
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_CONSTANTS.ACCESS_TOKEN)
            localStorage.removeItem(TOKEN_CONSTANTS.REFRESH_TOKEN)
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
import { API_ROUTES } from "@/shared/constants"
import { TOKEN_CONSTANTS } from "@/shared/constants"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"
import { cookieUtils } from "@/core/utils/cookie.utils"
import { errorService } from "@/core/services/error.service"
import { logger } from "@/core/utils/logger"
import { RetryUtils } from "@/core/utils/retry.utils"

// Base API Client - Just handle HTTP communication
class ApiClient {
    private axiosInstance: AxiosInstance
    private isDev = process.env.NODE_ENV === 'development'
    private retryConfig = {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 30000
    }

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor - Attach token
        this.axiosInstance.interceptors.request.use((config) => {
            // Get token from cookies only (no localStorage for security)
            const token = typeof window !== 'undefined'
                ? cookieUtils.getCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
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
                    const isAuthEndpoint = error.config?.url?.startsWith('/auth/')

                    if (!isAuthEndpoint) {
                        return this.handleTokenRefresh(error)
                    }
                }

                // Use centralized error service for logging
                const appError = errorService.handleApiError(error, {
                    url: error.config?.url,
                    method: error.config?.method,
                })

                // Log error with context (but don't handle retry here)
                logger.error('API request failed', 'ApiClient', {
                    url: error.config?.url,
                    method: error.config?.method,
                    status: error.response?.status,
                    error: appError.message,
                    code: appError.code
                })

                // Return the original error for retry logic to handle
                return Promise.reject(error)
            }
        )
    }

    private async handleTokenRefresh(originalError: AxiosError) {
        const refreshToken = typeof window !== 'undefined'
            ? cookieUtils.getCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
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
                // Save new token to cookies only (no localStorage for security)
                cookieUtils.setCookie(TOKEN_CONSTANTS.ACCESS_TOKEN, newToken, {
                    maxAge: 15 * 60 * 1000, // 15 minutes
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                })

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
        // Clear cookies only (no localStorage for security)
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
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

        return RetryUtils.retry(async () => {
            const response = await this.axiosInstance.request<T>(axiosConfig)
            const raw = response.data as any
            if (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) {
                return raw.data as T
            }
            return raw as T
        }, {
            maxAttempts: this.retryConfig.maxAttempts,
            baseDelay: this.retryConfig.baseDelay,
            maxDelay: this.retryConfig.maxDelay,
            onRetry: (attempt, error) => {
                logger.info('Retrying API request', 'ApiClient', {
                    url: endpoint,
                    method: config.method || 'GET',
                    attempt,
                    error: error.message
                })
            },
            onMaxAttemptsReached: (error) => {
                logger.error('Max retry attempts reached for API request', 'ApiClient', {
                    url: endpoint,
                    method: config.method || 'GET',
                    error: error.message
                })
            }
        })
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

    // Retry configuration methods
    setRetryConfig(config: Partial<typeof this.retryConfig>) {
        this.retryConfig = { ...this.retryConfig, ...config }
    }

    getRetryConfig() {
        return { ...this.retryConfig }
    }

    // Disable retry for specific requests
    async requestWithoutRetry<T = any>(
        endpoint: string,
        config: AxiosRequestConfig = {}
    ): Promise<T> {
        const axiosConfig: AxiosRequestConfig = {
            url: endpoint,
            ...config,
        }

        const response = await this.axiosInstance.request<T>(axiosConfig)
        const raw = response.data as any
        if (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) {
            return raw.data as T
        }
        return raw as T
    }
}

// Export singleton instance
export const apiClient = new ApiClient()
export { ApiClient }
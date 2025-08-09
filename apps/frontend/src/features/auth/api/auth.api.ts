/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/core/constants/routes'
import type { AuthApiResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types'

class AuthApi {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const res = await apiClient.post<AuthApiResponse>(API_ROUTES.AUTH.LOGIN, credentials)
        return this.transformAuthResponse(res)
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const res = await apiClient.post<AuthApiResponse>(API_ROUTES.AUTH.REGISTER, credentials)
        return this.transformAuthResponse(res)
    }

    async logout(): Promise<void> {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT)
    }

    async getProfile(): Promise<User> {
        return apiClient.get<User>(API_ROUTES.USERS.PROFILE)
    }

    async updateProfile(payload: Partial<User>): Promise<User> {
        return apiClient.put<User>(API_ROUTES.USERS.UPDATE, payload)
    }

    async refresh(): Promise<AuthResponse> {
        const res = await apiClient.post<AuthApiResponse>(API_ROUTES.AUTH.REFRESH, {})
        return this.transformAuthResponse(res)
    }

    private transformAuthResponse(response: AuthApiResponse): AuthResponse {
        const accessToken = response.accessToken ?? response.token
        if (!accessToken) {
            throw new Error('Invalid authentication response: missing access token')
        }
        const refreshToken = response.refreshToken
        if (!refreshToken) {
            throw new Error('Invalid authentication response: missing refresh token')
        }
        return {
            accessToken,
            refreshToken,
            user: response.user,
        }
    }
}

export const authApi = new AuthApi()

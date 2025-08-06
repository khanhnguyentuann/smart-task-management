import { apiService } from '@/shared/services/api'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types'

class AuthApi {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiService.login(credentials)
        return this.transformAuthResponse(response)
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiService.register(credentials)
        return this.transformAuthResponse(response)
    }

    async logout(): Promise<void> {
        await apiService.logout()
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await apiService.refreshToken(refreshToken)
        return this.transformAuthResponse(response)
    }

    private transformAuthResponse(response: any): AuthResponse {
        return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: {
                id: response.user.id,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
                role: response.user.role,
                createdAt: response.user.createdAt,
                avatar: response.user.avatar,
                department: response.user.department
            }
        }
    }
}

export const authApi = new AuthApi()
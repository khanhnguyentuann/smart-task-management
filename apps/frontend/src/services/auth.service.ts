import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth';

export const authService = {
    async register(data: RegisterDto): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', data);
            this.saveTokens(response.data);
            return response.data;
        } catch (error) {
            // Re-throw the error to let the component handle it
            throw error;
        }
    },

    async login(data: LoginDto): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', data);
            this.saveTokens(response.data);
            return response.data;
        } catch (error) {
            // Re-throw the error to let the component handle it
            throw error;
        }
    },

    async getMe(): Promise<{ user: User }> {
        const response = await apiClient.get<{ user: User }>('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Don't redirect here, let the component handle it
    },

    saveTokens(data: AuthResponse) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    isAuthenticated() {
        return !!this.getAccessToken();
    },
};
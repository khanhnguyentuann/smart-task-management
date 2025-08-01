import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth';
import { API_ENDPOINTS } from '@/constants/api';
import { authStorage } from '@/utils/storage';

export const authService = {
    async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
        this.saveTokens(response.data);
        return response.data;
    },

    async login(data: LoginDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
        this.saveTokens(response.data);
        return response.data;
    },

    async getMe(): Promise<{ user: User }> {
        const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
        return response.data;
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await apiClient.post<{ accessToken: string }>(
            API_ENDPOINTS.AUTH.REFRESH,
            { refreshToken }
        );
        return response.data;
    },

    logout() {
        authStorage.clear();
    },

    saveTokens(data: AuthResponse) {
        authStorage.setToken(data.accessToken);
        authStorage.setRefreshToken(data.refreshToken);
    },

    getAccessToken() {
        return authStorage.getToken();
    },

    isAuthenticated() {
        return !!this.getAccessToken();
    },
};
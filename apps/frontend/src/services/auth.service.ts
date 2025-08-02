import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth';
import { API_ENDPOINTS } from '@/constants/api';
import { authStorage } from '@/utils/storage';

export const authService = {
    async register(data: RegisterDto): Promise<AuthResponse> {
        console.log('📝 Registering user:', data.email);
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
        this.saveTokens(response.data);
        return response.data;
    },

    async login(data: LoginDto): Promise<AuthResponse> {
        console.log('🔐 Logging in user:', data.email);
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
        this.saveTokens(response.data);
        return response.data;
    },

    async getMe(): Promise<{ user: User }> {
        console.log('👤 Getting current user...');
        const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
        return response.data;
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        console.log('🔄 Refreshing token...');
        const response = await apiClient.post<{ accessToken: string }>(
            API_ENDPOINTS.AUTH.REFRESH,
            { refreshToken }
        );
        authStorage.setToken(response.data.accessToken);
        return response.data;
    },

    logout() {
        console.log('👋 Logging out...');
        authStorage.clear();
    },

    saveTokens(data: AuthResponse) {
        console.log('💾 Saving tokens...');
        authStorage.setToken(data.accessToken);
        authStorage.setRefreshToken(data.refreshToken);
        authStorage.setUser(data.user);
    },

    getAccessToken() {
        return authStorage.getToken();
    },

    isAuthenticated() {
        const token = this.getAccessToken();
        console.log('🔍 Checking authentication:', token ? '✅ Authenticated' : '❌ Not authenticated');
        return !!token;
    },
};
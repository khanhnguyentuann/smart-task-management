import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth';
import { API_ENDPOINTS } from '@/constants/api';

// Direct localStorage access to avoid circular dependency
const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem('accessToken');
    } catch (error) {
        console.error('Error reading token from localStorage:', error);
        return null;
    }
};

const setToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('accessToken', token);
    } catch (error) {
        console.error('Error setting token in localStorage:', error);
    }
};

const setRefreshToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('refreshToken', token);
    } catch (error) {
        console.error('Error setting refresh token in localStorage:', error);
    }
};

const setUser = (user: User): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error setting user in localStorage:', error);
    }
};

const clearAuth = (): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error clearing auth from localStorage:', error);
    }
};

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
        setToken(response.data.accessToken);
        return response.data;
    },

    logout() {
        console.log('👋 Logging out...');
        clearAuth();
    },

    saveTokens(data: AuthResponse) {
        console.log('💾 Saving tokens...');
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
    },

    getAccessToken() {
        return getToken();
    },

    isAuthenticated() {
        const token = this.getAccessToken();
        console.log('🔍 Checking authentication:', token ? '✅ Authenticated' : '❌ Not authenticated');
        return !!token;
    },
};
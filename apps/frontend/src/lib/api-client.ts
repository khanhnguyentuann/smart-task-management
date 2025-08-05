import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem('refreshToken');
    } catch (error) {
        console.error('Error reading refresh token from localStorage:', error);
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

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, token ? '✅ With Token' : '❌ No Token');
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor để handle errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
        return response;
    },
    async (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data);

        const originalRequest = error.config;

        // Skip refresh for login/register endpoints
        if (originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                console.log('🔄 Attempting token refresh...');
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                setToken(accessToken);
                console.log('✅ Token refreshed successfully');

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                // Clear storage and redirect to login
                clearAuth();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
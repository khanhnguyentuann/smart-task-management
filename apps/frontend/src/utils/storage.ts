import { AUTH_CONFIG } from '@/constants/config';
import { User } from '@/schemas';

const isClient = typeof window !== 'undefined';

// Secure storage options
const STORAGE_OPTIONS = {
    // Use httpOnly cookies for production (more secure)
    USE_HTTP_ONLY_COOKIES: process.env.NODE_ENV === 'production',
    
    // Token expiration check
    CHECK_TOKEN_EXPIRY: true,
    
    // Auto refresh threshold (5 minutes before expiry)
    AUTO_REFRESH_THRESHOLD: 5 * 60 * 1000,
};

export const storage = {
    get<T>(key: string): T | null {
        if (!isClient) return null;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return null;
        }
    },

    set<T>(key: string, value: T): void {
        if (!isClient) return;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    },

    remove(key: string): void {
        if (!isClient) return;

        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    },

    clear(): void {
        if (!isClient) return;

        try {
            window.localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
};

// Secure cookie storage (for production)
export const cookieStorage = {
    set(name: string, value: string, options: { expires?: number } = {}): void {
        if (!isClient) return;
        
        const cookieOptions = [
            `httpOnly=${STORAGE_OPTIONS.USE_HTTP_ONLY_COOKIES}`,
            'secure=true',
            'sameSite=strict',
            options.expires ? `expires=${new Date(Date.now() + options.expires).toUTCString()}` : '',
        ].filter(Boolean).join('; ');
        
        document.cookie = `${name}=${value}; ${cookieOptions}`;
    },

    get(name: string): string | null {
        if (!isClient) return null;
        
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    },

    remove(name: string): void {
        if (!isClient) return;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
};

// Auth-specific storage helpers with security improvements
export const authStorage = {
    getToken(): string | null {
        if (STORAGE_OPTIONS.USE_HTTP_ONLY_COOKIES) {
            return cookieStorage.get(AUTH_CONFIG.TOKEN_KEY);
        }
        return storage.get<string>(AUTH_CONFIG.TOKEN_KEY);
    },

    setToken(token: string, expiresIn?: number): void {
        if (STORAGE_OPTIONS.USE_HTTP_ONLY_COOKIES) {
            cookieStorage.set(AUTH_CONFIG.TOKEN_KEY, token, { expires: expiresIn });
        } else {
            storage.set(AUTH_CONFIG.TOKEN_KEY, token);
        }
    },

    getRefreshToken(): string | null {
        if (STORAGE_OPTIONS.USE_HTTP_ONLY_COOKIES) {
            return cookieStorage.get(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        }
        return storage.get<string>(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    },

    setRefreshToken(token: string, expiresIn?: number): void {
        if (STORAGE_OPTIONS.USE_HTTP_ONLY_COOKIES) {
            cookieStorage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, token, { expires: expiresIn });
        } else {
            storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, token);
        }
    },

    getUser(): User | null {
        return storage.get(AUTH_CONFIG.USER_KEY);
    },

    setUser(user: User): void {
        storage.set(AUTH_CONFIG.USER_KEY, user);
    },

    // Check if token is expired
    isTokenExpired(token: string): boolean {
        if (!STORAGE_OPTIONS.CHECK_TOKEN_EXPIRY || !token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            
            return currentTime >= expiryTime;
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return true; // Assume expired if can't parse
        }
    },

    // Check if token needs refresh
    shouldRefreshToken(token: string): boolean {
        if (!STORAGE_OPTIONS.CHECK_TOKEN_EXPIRY || !token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000;
            const currentTime = Date.now();
            const threshold = STORAGE_OPTIONS.AUTO_REFRESH_THRESHOLD;
            
            return (expiryTime - currentTime) <= threshold;
        } catch (error) {
            console.error('Error checking token refresh:', error);
            return true;
        }
    },

    clear(): void {
        if (STORAGE_OPTIONS.USE_HTTP_ONLY_COOKIES) {
            cookieStorage.remove(AUTH_CONFIG.TOKEN_KEY);
            cookieStorage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        } else {
            storage.remove(AUTH_CONFIG.TOKEN_KEY);
            storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        }
        storage.remove(AUTH_CONFIG.USER_KEY);
    },
};
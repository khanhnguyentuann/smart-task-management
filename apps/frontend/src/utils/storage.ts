import { AUTH_CONFIG } from '@/constants/config';
import { User } from '@/schemas';

const isClient = typeof window !== 'undefined';

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

// Auth-specific storage helpers
export const authStorage = {
    getToken(): string | null {
        return storage.get<string>(AUTH_CONFIG.TOKEN_KEY);
    },

    setToken(token: string): void {
        storage.set(AUTH_CONFIG.TOKEN_KEY, token);
    },

    getRefreshToken(): string | null {
        return storage.get<string>(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    },

    setRefreshToken(token: string): void {
        storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, token);
    },

    getUser(): User | null {
        return storage.get(AUTH_CONFIG.USER_KEY);
    },

    setUser(user: User): void {
        storage.set(AUTH_CONFIG.USER_KEY, user);
    },

    clear(): void {
        storage.remove(AUTH_CONFIG.TOKEN_KEY);
        storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        storage.remove(AUTH_CONFIG.USER_KEY);
    },
};
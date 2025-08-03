"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useRef,
    useMemo,
    useCallback,
} from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { authStorage } from '@/utils/storage';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    loading: true,
    isAuthenticated: false,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(defaultAuthContext.user);
    const [loading, setLoading] = useState<boolean>(defaultAuthContext.loading);
    const checkAuthCalled = useRef(false);

    const checkAuth = useCallback(async (): Promise<void> => {
        try {
            const token = authService.getAccessToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const cachedUser = authStorage.getUser();
            if (cachedUser) {
                setUser(cachedUser);
            }
            const response = await authService.getMe();
            setUser(response.user);
            authStorage.setUser(response.user);
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!checkAuthCalled.current) {
            checkAuthCalled.current = true;
            void checkAuth();
        }
    }, [checkAuth]);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        authStorage.setUser(response.user);
        router.push(ROUTES.DASHBOARD);
    }, [router]);

    const register = useCallback(async (email: string, password: string): Promise<void> => {
        const response = await authService.register({ email, password });
        setUser(response.user);
        authStorage.setUser(response.user);
        router.push(ROUTES.DASHBOARD);
    }, [router]);

    const logout = useCallback((): void => {
        authService.logout();
        setUser(null);
        authStorage.setUser(null as unknown as User);
        router.push(ROUTES.LOGIN);
    }, [router]);

    const updateUser = useCallback((updatedUser: User): void => {
        setUser(updatedUser);
        authStorage.setUser(updatedUser);
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<AuthContextType>(() => ({
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
    }), [user, loading, login, register, logout, updateUser]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    return useContext(AuthContext);
}
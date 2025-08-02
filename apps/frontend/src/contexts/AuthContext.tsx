"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { authStorage } from '@/utils/storage';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const checkAuthCalled = useRef(false);

    useEffect(() => {
        // Prevent double call in development
        if (!checkAuthCalled.current) {
            checkAuthCalled.current = true;
            checkAuth();
        }
    }, []);

    const checkAuth = async () => {
        console.log('🔍 AuthContext: Checking authentication...');
        try {
            // First check if we have a token
            const token = authService.getAccessToken();
            if (!token) {
                console.log('❌ No token found');
                setLoading(false);
                return;
            }

            // If we have a cached user, use it first
            const cachedUser = authStorage.getUser();
            if (cachedUser) {
                console.log('✅ Using cached user:', cachedUser.email);
                setUser(cachedUser);
            }

            // Then verify with backend
            const response = await authService.getMe();
            console.log('✅ User verified:', response.user.email);
            setUser(response.user);
            authStorage.setUser(response.user);
        } catch (error) {
            console.error('❌ Auth check failed:', error);
            // Don't clear tokens here, let the interceptor handle it
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        console.log('🔐 AuthContext: Logging in...');
        const response = await authService.login({ email, password });
        setUser(response.user);
        router.push(ROUTES.DASHBOARD);
    };

    const register = async (email: string, password: string) => {
        console.log('📝 AuthContext: Registering...');
        const response = await authService.register({ email, password });
        setUser(response.user);
        router.push(ROUTES.DASHBOARD);
    };

    const logout = () => {
        console.log('👋 AuthContext: Logging out...');
        authService.logout();
        setUser(null);
        router.push(ROUTES.LOGIN);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        authStorage.setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
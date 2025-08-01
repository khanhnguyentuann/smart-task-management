"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && requireAuth && !isAuthenticated) {
            router.push(ROUTES.LOGIN);
        }
    }, [loading, requireAuth, isAuthenticated, router]);

    if (loading) {
        return <LoadingScreen message="Đang kiểm tra phiên đăng nhập..." />;
    }

    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
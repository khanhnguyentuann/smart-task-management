"use client"

import { ReactNode } from "react"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { LoadingScreen } from "@/components/common/LoadingScreen"

interface AuthGuardProps {
    children: ReactNode
    requireAuth?: boolean
    redirectTo?: string
    fallback?: ReactNode
}

/**
 * Higher Order Component for protecting pages with authentication
 * @param props - Component props
 * @param props.children - The content to render if authentication check passes
 * @param props.requireAuth - Whether the page requires authentication (default: true)
 * @param props.redirectTo - Where to redirect authenticated users (for auth pages)
 * @param props.fallback - Custom loading component (optional)
 * @returns The protected component or loading screen
 */
export function AuthGuard({ 
    children, 
    requireAuth = true, 
    redirectTo,
    fallback 
}: AuthGuardProps) {
    const { loading, shouldRender } = useAuthRedirect({ 
        requireAuth, 
        redirectTo 
    })

    // Show loading while checking authentication OR don't render content
    if (loading || !shouldRender) {
        return fallback || <LoadingScreen message="Đang kiểm tra phiên đăng nhập..." />
    }

    // Render children only when authentication check passes and not loading
    return <>{children}</>
} 
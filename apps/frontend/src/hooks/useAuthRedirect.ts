"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { ROUTES } from "@/constants/routes"

interface UseAuthRedirectOptions {
    redirectTo?: string
    requireAuth?: boolean
}

/**
 * Custom hook for handling authentication redirects
 * @param options - Configuration options
 * @param options.redirectTo - Where to redirect authenticated users (for auth pages)
 * @param options.requireAuth - Whether the page requires authentication (default: true)
 * @returns Object with loading state and authentication status
 */
export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
    const router = useRouter()
    const { isAuthenticated, loading } = useAuth()
    const { redirectTo = ROUTES.DASHBOARD, requireAuth = true } = options

    useEffect(() => {
        if (loading) return

        if (requireAuth && !isAuthenticated) {
            // Page requires auth but user is not authenticated
            router.push(ROUTES.LOGIN)
        } else if (!requireAuth && isAuthenticated) {
            // Page doesn't require auth but user is authenticated (e.g., login/register pages)
            router.push(redirectTo)
        }
    }, [isAuthenticated, loading, requireAuth, redirectTo, router])

    // Don't render content while loading or when authentication check fails
    const shouldRender = !loading && (
        requireAuth ? isAuthenticated : !isAuthenticated
    )

    return {
        loading,
        isAuthenticated,
        shouldRender
    }
} 
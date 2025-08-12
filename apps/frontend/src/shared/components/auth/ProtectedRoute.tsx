"use client"

import { ReactNode } from "react"
import { useUser } from "@/features/layout"

interface ProtectedRouteProps {
    children: ReactNode
    fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
    const { user, isLoading } = useUser()

    // Show loading state while checking authentication
    if (isLoading) {
        return fallback
    }

    // If no user, return fallback (usually null or redirect)
    if (!user) {
        return fallback
    }

    // User is authenticated, render children
    return <>{children}</>
}

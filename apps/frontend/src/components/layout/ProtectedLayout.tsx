"use client"

import { ReactNode } from "react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

interface ProtectedLayoutProps {
    children: ReactNode
    fallback?: ReactNode
}

/**
 * Protected Layout that combines AuthGuard with DashboardLayout
 * Ensures no flash of unauthorized content including sidebar
 */
export function ProtectedLayout({ children, fallback }: ProtectedLayoutProps) {
    return (
        <AuthGuard fallback={fallback}>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </AuthGuard>
    )
} 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (requireAuth) {
                    await authService.getMe()
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                if (requireAuth) {
                    router.push("/login")
                }
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [requireAuth, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (requireAuth && !isAuthenticated) {
        return null
    }

    return <>{children}</>
}
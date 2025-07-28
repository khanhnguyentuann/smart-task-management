"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await authService.getMe()
            setUser(response.user)
        } catch (error) {
            router.push("/login")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push("/login")
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button onClick={handleLogout} variant="outline">
                        Logout
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {user?.email}!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Role: <span className="font-semibold">{user?.role}</span>
                        </p>
                        <p className="text-muted-foreground mt-2">
                            User ID: <span className="font-mono text-sm">{user?.id}</span>
                        </p>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-muted-foreground">
                    <p>Project and Task management features coming soon...</p>
                </div>
            </div>
        </div>
    )
}
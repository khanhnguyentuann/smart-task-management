"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Calendar,
    BarChart3,
    Bell
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { getGreeting } from "@/utils/date"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"

const pageInfo = {
    "/dashboard": {
        title: "Dashboard",
        description: "Welcome back to your workspace",
        icon: LayoutDashboard
    },
    "/projects": {
        title: "Projects",
        description: "Manage your projects and tasks",
        icon: FolderKanban
    },
    "/tasks": {
        title: "Tasks",
        description: "Track and manage your tasks",
        icon: CheckSquare
    },
    "/team": {
        title: "Team",
        description: "Collaborate with your team members",
        icon: Users
    },
    "/calendar": {
        title: "Calendar",
        description: "View your schedule and events",
        icon: Calendar
    },
    "/reports": {
        title: "Reports",
        description: "Analytics and insights",
        icon: BarChart3
    },
    "/profile": {
        title: "Profile",
        description: "Manage your account settings",
        icon: Users
    },
    "/settings": {
        title: "Settings",
        description: "Configure your preferences",
        icon: LayoutDashboard
    }
}

export function DashboardHeader() {
    const pathname = usePathname()
    const { user } = useAuth()
    const [greeting, setGreeting] = useState(getGreeting())

    // Memoize currentPage to prevent recalculation
    const currentPage = useMemo(() => {
        return pageInfo[pathname as keyof typeof pageInfo] || pageInfo["/dashboard"]
    }, [pathname])

    // Memoize isDashboard to prevent recalculation
    const isDashboard = useMemo(() => {
        return pathname === "/dashboard"
    }, [pathname])

    useEffect(() => {
        const updateGreeting = () => {
            setGreeting(getGreeting())
        }

        updateGreeting()
        // Update greeting every 30 minutes
        const interval = setInterval(updateGreeting, 1800000)

        return () => clearInterval(interval)
    }, [])

    return (
        <header className="h-16 bg-background border-b">
            <div className="flex h-full items-center px-6 gap-4">
                <SidebarTrigger />

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    {isDashboard ? (
                        <>
                            <motion.span
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                className="text-2xl"
                            >
                                🌅
                            </motion.span>
                        </>
                    ) : (
                        <currentPage.icon className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {isDashboard ? (
                                `${greeting.text}, ${user?.firstName || user?.email.split('@')[0]}!`
                            ) : (
                                currentPage.title
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isDashboard ? "Ready to make today productive?" : currentPage.description}
                        </p>
                    </div>
                </motion.div>

                {/* Notification Bell */}
                <div className="ml-auto relative">
                    <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {/* Notification Badge */}
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            2
                        </div>
                    </button>
                </div>
            </div>
        </header>
    )
}
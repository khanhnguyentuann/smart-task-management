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
import { getGreeting, formatDateTime } from "@/utils/date"

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
    const [greeting, setGreeting] = useState(getGreeting())
    const [currentTime, setCurrentTime] = useState(new Date())

    // Memoize currentPage to prevent recalculation
    const currentPage = useMemo(() => {
        return pageInfo[pathname as keyof typeof pageInfo] || pageInfo["/dashboard"]
    }, [pathname])

    // Memoize isDashboard to prevent recalculation
    const isDashboard = useMemo(() => {
        return pathname === "/dashboard"
    }, [pathname])

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date())
            setGreeting(getGreeting())
        }

        updateTime()
        // Increase interval to 30 seconds to reduce re-renders
        const interval = setInterval(updateTime, 30000)

        return () => clearInterval(interval)
    }, [])

    return (
        <header className="h-16 bg-background border-b">
            <div className="flex h-full items-center px-6 gap-4">
                <SidebarTrigger />

                <div className="flex items-center gap-3">
                    {isDashboard ? (
                        <greeting.icon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <currentPage.icon className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                        <h1 className="text-lg font-semibold">
                            {isDashboard ? greeting.text : currentPage.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isDashboard ? "Welcome back to your workspace" : currentPage.description}
                        </p>
                    </div>
                </div>

                {/* Current Date & Time - Centered */}
                <div className="flex-1 flex justify-center">
                    <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                            {formatDateTime(currentTime)}
                        </div>
                    </div>
                </div>

                {/* Notification Bell */}
                <div className="relative">
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
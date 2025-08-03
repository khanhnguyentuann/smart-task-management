"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Calendar,
    BarChart3
} from "lucide-react"

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
    const currentPage = pageInfo[pathname as keyof typeof pageInfo] || pageInfo["/dashboard"]

    return (
        <header className="h-16 bg-background border-b">
            <div className="flex h-full items-center px-6 gap-4">
                <SidebarTrigger />

                <div className="flex items-center gap-3">
                    <currentPage.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <h1 className="text-lg font-semibold">{currentPage.title}</h1>
                        <p className="text-sm text-muted-foreground">{currentPage.description}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
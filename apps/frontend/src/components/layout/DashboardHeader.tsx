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
    Bell,
    ArrowLeft
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { getGreeting } from "@/utils/date"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { EnhancedButton } from "@/components/ui/EnhancedButton"
import { projectService } from "@/services/project.service"

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
    "/projects/[id]": {
        title: "Website Redesign",
        description: "Project details and task management",
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
    const [projectName, setProjectName] = useState<string>("")

    // Memoize currentPage to prevent recalculation
    const currentPage = useMemo(() => {
        return pageInfo[pathname as keyof typeof pageInfo] || pageInfo["/dashboard"]
    }, [pathname])

    // Memoize isDashboard to prevent recalculation
    const isDashboard = useMemo(() => {
        return pathname === "/dashboard"
    }, [pathname])

    // Check if we're on a project detail page
    const isProjectDetail = useMemo(() => {
        return pathname.startsWith("/projects/") && pathname !== "/projects"
    }, [pathname])

    // Fetch project name from API when on project detail page
    useEffect(() => {
        const fetchProjectName = async () => {
            if (isProjectDetail) {
                try {
                    const projectId = pathname.split("/projects/")[1]
                    const project = await projectService.getById(projectId)
                    setProjectName(project.name)
                } catch (error) {
                    console.error("Failed to fetch project:", error)
                    setProjectName("Project")
                }
            } else {
                setProjectName("")
            }
        }

        fetchProjectName()
    }, [isProjectDetail, pathname])

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

                {isProjectDetail ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <EnhancedButton variant="ghost" size="sm" onClick={() => window.history.back()}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Projects
                                </EnhancedButton>
                            </motion.div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-semibold">{projectName || "Loading..."}</h1>
                            </div>
                        </motion.div>
                    </>
                ) : (
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
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-full shadow-lg"
                            >
                                <currentPage.icon className="h-5 w-5 text-white" />
                            </motion.div>
                        )}
                        <div>
                            <h1 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
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
                )}

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
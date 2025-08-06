"use client"

import { useState, useEffect } from "react"
import { CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { FolderKanban, CheckSquare, Clock, AlertTriangle, Plus, Activity, TrendingUp, Users, Star } from "lucide-react"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/shared/components/ui/progress"

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: "ADMIN" | "MEMBER"
    avatar: string
    department?: string
}

interface DashboardContentProps {
    user: User | null
    onNavigate: (page: string) => void
}

export function EnhancedDashboardContent({ user, onNavigate }: DashboardContentProps) {
    const [stats] = useState({
        totalProjects: 12,
        activeTasks: 28,
        completedTasks: 156,
        overdueTasks: 3,
    })

    const [greeting, setGreeting] = useState("")
    const [timeEmoji, setTimeEmoji] = useState("")

    const [recentActivities] = useState([
        {
            id: 1,
            type: "task_completed",
            user: "Sarah Wilson",
            action: "completed task",
            target: "Update user authentication",
            time: "2 minutes ago",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            status: "success",
            icon: CheckSquare,
        },
        {
            id: 2,
            type: "project_created",
            user: "Mike Johnson",
            action: "created project",
            target: "Mobile App Redesign",
            time: "1 hour ago",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            status: "info",
            icon: FolderKanban,
        },
        {
            id: 3,
            type: "task_assigned",
            user: "Emily Chen",
            action: "assigned task",
            target: "Database optimization",
            time: "3 hours ago",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            status: "warning",
            icon: Users,
        },
        {
            id: 4,
            type: "milestone_reached",
            user: "Team Member",
            action: "reached milestone",
            target: "50% project completion",
            time: "5 hours ago",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            status: "success",
            icon: Star,
        },
    ])

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours()
            const firstName = user?.firstName || "User"

            if (hour < 12) {
                setGreeting(`Good morning, ${firstName}!`)
                setTimeEmoji("🌅")
            } else if (hour < 17) {
                setGreeting(`Good afternoon, ${firstName}!`)
                setTimeEmoji("☀️")
            } else {
                setGreeting(`Good evening, ${firstName}!`)
                setTimeEmoji("🌙")
            }
        }

        if (user?.firstName) {
            updateGreeting()
            const interval = setInterval(updateGreeting, 60000) // Update every minute
            return () => clearInterval(interval)
        }
    }, [user?.firstName])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "success":
                return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
            case "warning":
                return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
            case "info":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            default:
                return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    // Add null check for user
    if (!user) {
        return (
            <div className="flex flex-col h-full relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🤖</div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to Smart Task</h2>
                        <p className="text-muted-foreground">Please log in to continue</p>
                    </div>
                </div>
            </div>
        )
    }

    const statsData = [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "from-blue-500 to-blue-600",
            iconColor: "text-blue-600",
            change: "+2 from last month",
            progress: 75,
            trend: "up",
        },
        {
            title: "Active Tasks",
            value: stats.activeTasks,
            icon: CheckSquare,
            color: "from-green-500 to-green-600",
            iconColor: "text-green-600",
            change: "+5 from yesterday",
            progress: 85,
            trend: "up",
        },
        {
            title: "Completed Tasks",
            value: stats.completedTasks,
            icon: Clock,
            color: "from-purple-500 to-purple-600",
            iconColor: "text-purple-600",
            change: "+12 this week",
            progress: 92,
            trend: "up",
        },
        {
            title: "Overdue Tasks",
            value: stats.overdueTasks,
            icon: AlertTriangle,
            color: "from-red-500 to-red-600",
            iconColor: "text-red-600",
            change: "Needs attention",
            progress: 15,
            trend: "down",
        },
    ]

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Floating Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-5 dark:opacity-10"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            rotate: 360,
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    >
                        <div
                            className={`w-${8 + Math.floor(Math.random() * 16)} h-${8 + Math.floor(Math.random() * 16)} 
                ${Math.random() > 0.5 ? "rounded-full" : "rounded-lg"} 
                bg-gradient-to-br from-blue-400 to-purple-400`}
                        />
                    </motion.div>
                ))}
            </div>

            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
                <div className="flex h-14 items-center gap-4 px-6">
                    <SidebarTrigger />
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            className="text-2xl"
                        >
                            {timeEmoji}
                        </motion.span>
                        <div>
                            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {greeting}
                            </h1>
                            <p className="text-sm text-muted-foreground">Ready to make today productive?</p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6 relative z-10">
                <div className="space-y-8">
                    {/* Overview Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                    >
                        {statsData.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="group"
                            >
                                <GlassmorphismCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                    {/* Gradient Background */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                                    />

                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                        <motion.div
                                            whileHover={{ rotate: 15, scale: 1.2 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className={`p-2 rounded-full bg-gradient-to-br ${stat.color} shadow-lg`}
                                        >
                                            <stat.icon className="h-4 w-4 text-white" />
                                        </motion.div>
                                    </CardHeader>

                                    <CardContent className="relative z-10">
                                        <div className="space-y-3">
                                            <motion.div
                                                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                                            >
                                                {stat.value}
                                            </motion.div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">{stat.change}</span>
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                        className={stat.trend === "up" ? "text-green-500" : "text-red-500"}
                                                    >
                                                        <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                                                    </motion.div>
                                                </div>

                                                <div className="space-y-1">
                                                    <Progress value={stat.progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                                                    <div className="text-xs text-muted-foreground text-right">{stat.progress}% of target</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </GlassmorphismCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Recent Activities */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <GlassmorphismCard className="shadow-xl border-0">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3">
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                            className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg"
                                        >
                                            <Activity className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Recent Activities
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {recentActivities.map((activity, index) => (
                                                <motion.div
                                                    key={activity.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 group"
                                                >
                                                    <div className="relative">
                                                        <motion.div whileHover={{ scale: 1.1 }}>
                                                            <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800 shadow-lg">
                                                                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                                                    {activity.user
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </motion.div>

                                                        <motion.div
                                                            className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getStatusColor(activity.status)} shadow-lg`}
                                                            whileHover={{ scale: 1.2 }}
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                        >
                                                            <activity.icon className="h-3 w-3" />
                                                        </motion.div>
                                                    </div>

                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm leading-relaxed">
                                                            <span className="font-semibold text-blue-600 dark:text-blue-400">{activity.user}</span>{" "}
                                                            <span className="text-muted-foreground">{activity.action}</span>{" "}
                                                            <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                                {activity.target}
                                                            </span>
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <motion.div
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                                className="w-1 h-1 bg-blue-500 rounded-full"
                                                            />
                                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </GlassmorphismCard>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <GlassmorphismCard className="shadow-xl border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <motion.div
                                            whileHover={{ rotate: 180 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-full shadow-lg"
                                        >
                                            <Plus className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                            Quick Actions
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                                                         {user.role === "ADMIN" && (
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <EnhancedButton
                                                onClick={() => onNavigate("projects")}
                                                className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                                                size="lg"
                                            >
                                                <motion.div
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                >
                                                    <Plus className="h-5 w-5 mr-3" />
                                                </motion.div>
                                                Create New Project
                                            </EnhancedButton>
                                        </motion.div>
                                    )}

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <EnhancedButton
                                            onClick={() => onNavigate("my-tasks")}
                                            variant="outline"
                                            className="w-full justify-start border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-950/20"
                                            size="lg"
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            >
                                                <CheckSquare className="h-5 w-5 mr-3 text-green-600" />
                                            </motion.div>
                                            Create New Task
                                        </EnhancedButton>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <EnhancedButton
                                            onClick={() => onNavigate("projects")}
                                            variant="outline"
                                            className="w-full justify-start border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/20"
                                            size="lg"
                                        >
                                            <motion.div
                                                animate={{ rotate: [0, 15, -15, 0] }}
                                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                            >
                                                <FolderKanban className="h-5 w-5 mr-3 text-purple-600" />
                                            </motion.div>
                                            View All Projects
                                        </EnhancedButton>
                                    </motion.div>
                                </CardContent>
                            </GlassmorphismCard>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
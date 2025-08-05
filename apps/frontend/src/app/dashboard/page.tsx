"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { projectService } from "@/services/project.service"
import { ROUTES } from "@/constants/routes"
import { DASHBOARD_CONFIG } from "@/constants/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Loader2, FolderOpen, CheckSquare, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"
import { TaskStatusChart } from "@/components/charts"

export default function DashboardPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [projectCount, setProjectCount] = useState(0)
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                const projects = await projectService.getAll()
                if (isMounted) {
                    setProjectCount(projects.length)
                }
            } catch (error) {
                console.error('Data fetch failed:', error)
            } finally {
                if (isMounted) {
                    setDataLoading(false)
                }
            }
        }

        fetchData()
        
        // Cleanup function to prevent memory leaks
        return () => {
            isMounted = false;
        }
    }, [])

    // Memoize stats to prevent recalculation
    const stats = useMemo(() => [
        {
            title: "Total Projects",
            value: projectCount,
            icon: FolderOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            description: projectCount === 0 ? "Create your first project" : `${projectCount} active project${projectCount !== 1 ? 's' : ''}`,
            link: projectCount === 0 ? "/projects" : undefined
        },
        {
            title: "Active Tasks",
            value: DASHBOARD_CONFIG.DEFAULT_ACTIVE_TASKS,
            icon: CheckSquare,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
            description: "No tasks assigned"
        },
        {
            title: "Team Members",
            value: DASHBOARD_CONFIG.DEFAULT_TEAM_MEMBERS,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
            description: "Just you for now"
        },
        {
            title: "Completion Rate",
            value: DASHBOARD_CONFIG.DEFAULT_COMPLETION_RATE,
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
            description: "No completed tasks"
        }
    ], [projectCount])

    // Show loading while fetching data
    if (dataLoading) {
        return (
            <ProtectedLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
            </ProtectedLayout>
        )
    }

    return (
        <ProtectedLayout>
            <AnimatedBackground />
            <div className="p-6 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {user?.firstName || user?.email.split('@')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here&#39;s what&#39;s happening with your projects today
                    </p>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DASHBOARD_CONFIG.ANIMATION_DURATION, delay: index * DASHBOARD_CONFIG.ANIMATION_DELAY }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.link ? (
                                            <Link href={stat.link}>
                                                <Button variant="link" className="p-0 h-auto text-xs">
                                                    {stat.description}
                                                </Button>
                                            </Link>
                                        ) : (
                                            stat.description
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Task Status Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DASHBOARD_CONFIG.ANIMATION_DURATION, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Status Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TaskStatusChart className="h-64" />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DASHBOARD_CONFIG.ANIMATION_DURATION, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <Button
                                onClick={() => router.push(ROUTES.PROJECTS)}
                                className="w-full"
                                variant="outline"
                            >
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Create New Project
                            </Button>
                            <Button
                                onClick={() => router.push(ROUTES.TASKS)}
                                className="w-full"
                                variant="outline"
                            >
                                <CheckSquare className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                            <Button
                                onClick={() => router.push(ROUTES.TEAM)}
                                className="w-full"
                                variant="outline"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Invite Team Member
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </ProtectedLayout>
    )
}
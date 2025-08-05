"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Plus, Users, Settings, CheckSquare, Clock, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/contexts/ToastContext"
import { GlassmorphismCard } from "@/components/ui/GlassmorphismCard"
import { EnhancedButton } from "@/components/ui/EnhancedButton"

interface User {
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
}

interface Task {
    id: string
    title: string
    aiSummary: string
    priority: "Low" | "Medium" | "High"
    assignee: {
        name: string
        avatar: string
    }
    deadline: string
    status: "todo" | "inProgress" | "done"
}

interface Project {
    id: string
    name: string
    description: string
    members: User[]
}

export default function ProjectDetailPage() {
    const params = useParams()
    const { toast } = useToast()
    const [, setShowCreateTask] = useState(false)

    // Mock data for project
    const [project] = useState<Project>({
        id: params.id as string,
        name: "Website Redesign",
        description: "Complete overhaul of company website with modern design and improved user experience",
        members: [
            { name: "John Doe", email: "john@example.com", avatar: "/placeholder.svg?height=32&width=32", role: "Admin" },
            { name: "Sarah Wilson", email: "sarah@example.com", avatar: "/placeholder.svg?height=32&width=32", role: "Member" },
            { name: "Mike Johnson", email: "mike@example.com", avatar: "/placeholder.svg?height=32&width=32", role: "Member" },
            { name: "Emily Davis", email: "emily@example.com", avatar: "/placeholder.svg?height=32&width=32", role: "Member" },
        ],
    })

    // Mock data for tasks
    const [tasks] = useState<Task[]>([
        {
            id: "1",
            title: "Design new homepage layout",
            aiSummary: "Create modern, responsive homepage with hero section, feature highlights, and improved navigation structure",
            priority: "High",
            assignee: { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
            deadline: "2024-02-15",
            status: "inProgress",
        },
        {
            id: "2",
            title: "Implement user authentication",
            aiSummary: "Develop secure login/signup system with password reset functionality and social media integration",
            priority: "Medium",
            assignee: { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
            deadline: "2024-02-20",
            status: "todo",
        },
        {
            id: "3",
            title: "Optimize page loading speed",
            aiSummary: "Improve website performance through image optimization, code splitting, and caching strategies",
            priority: "Low",
            assignee: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
            deadline: "2024-02-10",
            status: "done",
        },
        {
            id: "4",
            title: "Create mobile responsive design",
            aiSummary: "Ensure website works perfectly on all mobile devices with touch-friendly interface",
            priority: "High",
            assignee: { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32" },
            deadline: "2024-02-25",
            status: "todo",
        },
        {
            id: "5",
            title: "Set up analytics tracking",
            aiSummary: "Implement Google Analytics and custom event tracking for user behavior analysis",
            priority: "Medium",
            assignee: { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
            deadline: "2024-02-18",
            status: "inProgress",
        },
    ])

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "bg-red-500"
            case "Medium":
                return "bg-yellow-500"
            case "Low":
                return "bg-green-500"
            default:
                return "bg-gray-500"
        }
    }

    const getDeadlineStatus = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { color: "text-red-600", label: "Overdue" }
        if (diffDays === 0) return { color: "text-yellow-600", label: "Due today" }
        if (diffDays <= 3) return { color: "text-yellow-600", label: `Due in ${diffDays} days` }
        return { color: "text-muted-foreground", label: `Due in ${diffDays} days` }
    }

    const AnimatedTaskCard = ({ task }: { task: Task }) => {
        const deadlineStatus = getDeadlineStatus(task.deadline)

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={task.status === "done" ? "animate-sparkle" : ""}
            >
                <GlassmorphismCard className="group cursor-pointer">
                    <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium group-hover:text-blue-600 transition-colors">{task.title}</h4>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                />
                                <Badge variant="outline" className="text-xs">
                                    {task.priority}
                                </Badge>
                            </div>
                        </div>

                        {/* AI Summary with kawaii robot */}
                        <motion.div
                            className="flex items-start gap-2 p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-md backdrop-blur-sm"
                            whileHover={{ scale: 1.02 }}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            >
                                <div className="text-blue-600 text-sm">🤖✨</div>
                            </motion.div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{task.aiSummary}</p>
                        </motion.div>

                        <div className="flex items-center justify-between">
                            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                                <Avatar className="h-6 w-6 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                                    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                                    <AvatarFallback className="text-xs">
                                        {task.assignee.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                            </motion.div>

                            <motion.div
                                className={`text-xs flex items-center gap-1 ${deadlineStatus.color}`}
                                whileHover={{ scale: 1.1 }}
                            >
                                <Clock className="h-3 w-3" />
                                {deadlineStatus.label}
                            </motion.div>
                        </div>

                        {/* Completed task celebration */}
                        {task.status === "done" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 text-2xl">
                                ✨
                            </motion.div>
                        )}
                    </div>
                </GlassmorphismCard>
            </motion.div>
        )
    }

    const tasksByStatus = {
        todo: tasks.filter((task) => task.status === "todo"),
        inProgress: tasks.filter((task) => task.status === "inProgress"),
        done: tasks.filter((task) => task.status === "done"),
    }

    const handleCreateTask = () => {
        setShowCreateTask(true)
        toast({
            title: "Create Task",
            description: "Task creation modal will be implemented here",
        })
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Floating Background Shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute opacity-5 dark:opacity-10"
                                initial={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                                }}
                                animate={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 25 + Math.random() * 15,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            >
                                <div
                                    className={`w-${12 + Math.floor(Math.random() * 20)} h-${12 + Math.floor(Math.random() * 20)} 
                    ${Math.random() > 0.5 ? "rounded-full" : "rounded-lg"} 
                    bg-gradient-to-br from-green-400 to-blue-400`}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto relative z-10">
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Project Info */}
                                <GlassmorphismCard>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-muted-foreground">{project.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {project.members.slice(0, 3).map((member, index) => (
                                                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                                            <AvatarFallback>
                                                                {member.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {project.members.length > 3 && (
                                                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                                            +{project.members.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <EnhancedButton onClick={handleCreateTask}>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Task
                                                    </EnhancedButton>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </GlassmorphismCard>

                                {/* Tabs */}
                                <Tabs defaultValue="tasks" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="tasks" className="flex items-center gap-2">
                                            <CheckSquare className="h-4 w-4" />
                                            Tasks
                                        </TabsTrigger>
                                        <TabsTrigger value="members" className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Members
                                        </TabsTrigger>
                                        <TabsTrigger value="settings" className="flex items-center gap-2">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="tasks" className="space-y-4">
                                        {/* Task Board */}
                                        <div className="grid gap-6 lg:grid-cols-3">
                                            {/* To Do Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        To Do ({tasksByStatus.todo.length})
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {tasksByStatus.todo.map((task) => (
                                                        <AnimatedTaskCard key={task.id} task={task} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* In Progress Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                                                        In Progress ({tasksByStatus.inProgress.length})
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {tasksByStatus.inProgress.map((task) => (
                                                        <AnimatedTaskCard key={task.id} task={task} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Done Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <CheckSquare className="h-4 w-4 text-green-500" />
                                                        Done ({tasksByStatus.done.length})
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {tasksByStatus.done.map((task) => (
                                                        <AnimatedTaskCard key={task.id} task={task} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="members" className="space-y-4">
                                        <GlassmorphismCard>
                                            <CardHeader>
                                                <CardTitle>Project Members</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {project.members.map((member, index) => (
                                                        <div key={index} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar>
                                                                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                                                    <AvatarFallback>
                                                                        {member.name
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{member.name}</p>
                                                                    <Badge variant={member.role === "Admin" ? "default" : "secondary"}>{member.role}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </GlassmorphismCard>
                                    </TabsContent>

                                    <TabsContent value="settings" className="space-y-4">
                                        <GlassmorphismCard>
                                            <CardHeader>
                                                <CardTitle>Project Settings</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground">Project settings will be available here.</p>
                                            </CardContent>
                                        </GlassmorphismCard>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
} 
"use client"

import React, { useCallback } from "react"
import { useState } from "react"
import { Input } from "@/shared/components/ui/input"
import { Search, CheckSquare, Clock, AlertTriangle, Calendar } from 'lucide-react'
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button/Button"
import { Task } from "../../types/task.types"
import { TaskCard } from "./TaskCard"
import { EmptyState } from "./EmptyState"

interface User {
    id: string
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
}

interface MyTasksProps {
    user: User
    onTaskClick: (task: Task) => void
}

export function MyTasks({ user, onTaskClick }: MyTasksProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Map backend task to UI task shape
    const toUiTask = React.useCallback((t: any): Task => {
        const priorityMap: Record<string, Task["priority"]> = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" }
        const statusMap: Record<string, Task["status"]> = { TODO: "TODO", IN_PROGRESS: "IN_PROGRESS", DONE: "DONE" }
        return {
            id: t.id,
            title: t.title,
            description: t.description,
            aiSummary: t.summary || "",
            priority: priorityMap[t.priority] || "Medium",
            status: statusMap[t.status] || "TODO",
            project: t.project?.name || "",
            projectId: t.projectId,
            deadline: (t as any).dueDate || t.deadline || new Date().toISOString(),
            dueDate: (t as any).dueDate ? new Date((t as any).dueDate) : null,
            assignee: { 
                id: t.assignee?.id,
                name: t.assignee?.email || user.email, 
                avatar: user.avatar,
                email: t.assignee?.email || user.email
            },
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        }
    }, [user.email, user.avatar])

    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                setError(null)
                const { apiService } = await import("@/core/services/api")
                const resp = await apiService.getTasks()
                const tasksData = (resp as any).data || resp
                const tasksArray = Array.isArray(tasksData) ? tasksData : tasksData?.tasks
                setTasks(Array.isArray(tasksArray) ? tasksArray.map(toUiTask) : [])
            } catch (e: any) {
                console.error("Failed to fetch tasks:", e)
                if (e.message?.includes('Authentication') || e.message?.includes('Unauthorized')) {
                    setError("Authentication required. Please login again.")
                } else {
                    setError(e.message || "Failed to load tasks")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [user.email, user.avatar, toUiTask])

    const handleTaskClick = (task: Task) => {
        onTaskClick(task)
    }

    if (error) {
        return (
            <div className="flex flex-col h-full">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-6">
                        <SidebarTrigger />
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold">My Tasks</h1>
                        </div>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        {error.includes('Authentication') ? (
                            <div className="space-y-4">
                                <p className="text-red-600 text-lg font-medium">Authentication Required</p>
                                <p className="text-muted-foreground">Your session has expired. Please login again.</p>
                                <Button onClick={() => window.location.href = '/login'}>
                                    Go to Login
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-red-600 text-lg font-medium">Error Loading Tasks</p>
                                <p className="text-muted-foreground">{error}</p>
                                <Button onClick={() => window.location.reload()}>
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const getDeadlineStatus = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { color: "text-red-600", label: "Overdue", category: "overdue" }
        if (diffDays === 0) return { color: "text-yellow-600", label: "Due today", category: "today" }
        if (diffDays <= 7) return { color: "text-yellow-600", label: `Due in ${diffDays} days`, category: "thisWeek" }
        return { color: "text-muted-foreground", label: `Due in ${diffDays} days`, category: "later" }
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.project.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    const groupedTasks = {
        overdue: filteredTasks.filter((task) => getDeadlineStatus((task as any).dueDate || task.deadline).category === "overdue"),
        today: filteredTasks.filter((task) => getDeadlineStatus((task as any).dueDate || task.deadline).category === "today"),
        thisWeek: filteredTasks.filter((task) => getDeadlineStatus((task as any).dueDate || task.deadline).category === "thisWeek"),
        later: filteredTasks.filter((task) => getDeadlineStatus((task as any).dueDate || task.deadline).category === "later"),
    }

    const TaskGroup = ({ title, tasks, icon }: { title: string; tasks: Task[]; icon: React.ReactNode }) => {
        if (tasks.length === 0) return null

        return (
            <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                    {icon}
                    {title} ({tasks.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-6">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">My Tasks</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                    {loading && <div className="text-center text-sm">Loading tasks...</div>}
                    {error && <div className="text-center text-sm text-red-600">{error}</div>}

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="TODO">To Do</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="DONE">Done</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Task Groups */}
                    <div className="space-y-8">
                        <TaskGroup
                            title="Overdue"
                            tasks={groupedTasks.overdue}
                            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                        />
                        <TaskGroup
                            title="Due Today"
                            tasks={groupedTasks.today}
                            icon={<Clock className="h-4 w-4 text-yellow-500" />}
                        />
                        <TaskGroup
                            title="This Week"
                            tasks={groupedTasks.thisWeek}
                            icon={<Calendar className="h-4 w-4 text-blue-500" />}
                        />
                        <TaskGroup
                            title="Later"
                            tasks={groupedTasks.later}
                            icon={<CheckSquare className="h-4 w-4 text-green-500" />}
                        />
                    </div>

                    {filteredTasks.length === 0 && (
                        <EmptyState
                            searchQuery={searchQuery}
                            statusFilter={statusFilter}
                            priorityFilter={priorityFilter}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

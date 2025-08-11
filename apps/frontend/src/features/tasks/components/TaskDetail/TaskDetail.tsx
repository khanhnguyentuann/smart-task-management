"use client"

import React, { useState, useRef, useMemo, useCallback } from "react"
import { Button } from "@/shared/components/ui/button/Button"
import { Separator } from "@/shared/components/ui/separator"
import { ArrowLeft, Archive } from 'lucide-react'
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { motion } from "framer-motion"
import { TaskDetail as TaskDetailType } from "../../types/task.types"
import { useToast } from "@/shared/hooks/useToast"
import { useUser } from "@/features/layout"

// Import modular components
import { TaskDetailHeader } from "./TaskDetailHeader"
import { TaskDetailTabs } from "./TaskDetailTabs"
import { DeleteTaskModal } from "../Modals/DeleteTaskModal"

interface TaskDetailProps {
    taskId: string
    onBack: () => void
    onDelete?: () => void
}

export function TaskDetail({ taskId, onBack, onDelete }: TaskDetailProps) {
    const { user } = useUser()
    
    // State management
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [newSubtask, setNewSubtask] = useState("")
    const [newLabel, setNewLabel] = useState("")
    const [activeTab, setActiveTab] = useState("details")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [task, setTask] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const { toast } = useToast()

    // Convert simple task to detailed task format
    const convertToDetailedTask = useCallback((simpleTask: any): TaskDetailType => {
        const priorityMap: Record<string, string> = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }
        const statusMap: Record<string, string> = { TODO: 'TODO', IN_PROGRESS: 'IN_PROGRESS', DONE: 'DONE' }

        return {
            id: simpleTask.id,
            title: simpleTask.title,
            description: simpleTask.description || simpleTask.aiSummary || "",
            status: statusMap[simpleTask.status] as 'TODO' | 'IN_PROGRESS' | 'DONE' || 'TODO',
            priority: priorityMap[simpleTask.priority] as 'LOW' | 'MEDIUM' | 'HIGH' || 'MEDIUM',
            assignees: simpleTask.assignee ? [{
                id: simpleTask.assignee.id || "1",
                name: simpleTask.assignee.name || simpleTask.assignee.email || "Unassigned",
                avatar: simpleTask.assignee.avatar || "",
                email: simpleTask.assignee.email || `${(simpleTask.assignee.name || "user").toLowerCase().replace(" ", ".")}@company.com`
            }] : [],
            dueDate: (simpleTask as any).dueDate ? new Date((simpleTask as any).dueDate) : (simpleTask.deadline ? new Date(simpleTask.deadline) : null),
            labels: simpleTask.labels || [
                { id: "1", name: "Frontend", color: "bg-blue-500" },
                { id: "2", name: "High Priority", color: "bg-red-500" }
            ],
            subtasks: simpleTask.subtasks || [
                { id: "1", title: "Research design patterns", completed: true },
                { id: "2", title: "Create wireframes", completed: false },
                { id: "3", title: "Implement responsive layout", completed: false }
            ],
            attachments: simpleTask.attachments || [
                {
                    id: "1",
                    name: "design-mockup.figma",
                    size: "2.4 MB",
                    type: "application/figma",
                    url: "#",
                    uploadedBy: "Sarah Wilson",
                    uploadedAt: new Date(Date.now() - 86400000)
                }
            ],
            comments: simpleTask.comments || [
                {
                    id: "1",
                    content: "Great progress on this task! The design looks amazing.",
                    author: {
                        id: "2",
                        name: "Mike Johnson",
                        avatar: "/default-avatar.svg"
                    },
                    createdAt: new Date(Date.now() - 3600000),
                    mentions: []
                }
            ],
            activities: simpleTask.activities || [
                {
                    id: "1",
                    type: "status_change",
                    description: "moved this task from To Do to In Progress",
                    user: {
                        id: "1",
                        name: user?.firstName ? `${user.firstName} ${user.lastName}` : "User",
                        avatar: user?.avatar || ""
                    },
                    timestamp: new Date(Date.now() - 7200000)
                },
                {
                    id: "2",
                    type: "comment",
                    description: "added a comment",
                    user: {
                        id: "2",
                        name: "Mike Johnson",
                        avatar: "/default-avatar.svg"
                    },
                    timestamp: new Date(Date.now() - 3600000)
                }
            ],
            createdAt: simpleTask.createdAt ? new Date(simpleTask.createdAt) : new Date(Date.now() - 604800000),
            updatedAt: simpleTask.updatedAt ? new Date(simpleTask.updatedAt) : new Date(Date.now() - 3600000)
        }
    }, [user])

    // Load task data
    React.useEffect(() => {
        let isMounted = true
        const loadTask = async () => {
            if (!taskId) return
            try {
                setLoading(true)
                setError(null)
                const { apiClient } = await import("@/core/services/api-client")
                const { API_ROUTES } = await import("@/core/constants/routes")
                const resp = await apiClient.get(API_ROUTES.TASKS.DETAIL(taskId))
                const taskData = (resp as any).data || resp

                if (!isMounted) return
                setTask(taskData)
            } catch (e: any) {
                if (!isMounted) return
                setError(e.message || "Failed to load task")
            } finally {
                if (!isMounted) return
                setLoading(false)
            }
        }
        loadTask()
        return () => { isMounted = false }
    }, [taskId])

    const detailedTask = useMemo<TaskDetailType | null>(() => (task ? convertToDetailedTask(task) : null), [task, convertToDetailedTask])
    const currentTask = editedTask || detailedTask
    const isOwner = task?.project?.ownerId === user?.id

    // Handler functions
    const handleEdit = useCallback(() => {
        setEditedTask({ ...currentTask })
        setIsEditing(true)
    }, [currentTask])

    const handleSave = useCallback(async () => {
        if (editedTask) {
            try {
                const { apiClient } = await import("@/core/services/api-client")
                const { API_ROUTES } = await import("@/core/constants/routes")
                const statusMap: Record<string, string> = { TODO: 'TODO', IN_PROGRESS: 'IN_PROGRESS', DONE: 'DONE' }
                const priorityMap: Record<string, string> = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }

                const payload: any = {
                    title: editedTask.title,
                    description: editedTask.description,
                    status: statusMap[editedTask.status] || 'TODO',
                    priority: priorityMap[editedTask.priority] || 'MEDIUM',
                    dueDate: editedTask.dueDate ? new Date(editedTask.dueDate).toISOString() : undefined,
                }

                await apiClient.put(API_ROUTES.TASKS.UPDATE(editedTask.id), payload)

                // Refresh task data after update
                const resp = await apiClient.get(API_ROUTES.TASKS.DETAIL(editedTask.id))
                const taskData = (resp as any).data || resp
                setTask(taskData)

                setIsEditing(false)
                setEditedTask(null)

                toast({
                    title: "Task Updated",
                    description: "Your changes have been saved successfully.",
                })
            } catch (error) {
                console.error("Failed to save task:", error)
                toast({
                    variant: "destructive",
                    title: "Save Failed",
                    description: "Failed to save changes. Please try again.",
                })
            }
        }
    }, [editedTask, toast])

    const handleCancel = useCallback(() => {
        setEditedTask(null)
        setIsEditing(false)
    }, [])

    const handleFieldChange = useCallback((field: string, value: any) => {
        setEditedTask((prev: any) => (prev ? { ...prev, [field]: value } : prev))
    }, [])

    const handleDelete = useCallback(async () => {
        if (!currentTask) return

        try {
            const { apiClient } = await import("@/core/services/api-client")
            const { API_ROUTES } = await import("@/core/constants/routes")
            await apiClient.delete(API_ROUTES.TASKS.DELETE(currentTask.id))

            toast({
                title: "Task Deleted",
                description: "The task has been successfully deleted.",
            })

            onBack()
            onDelete?.()
        } catch (error) {
            console.error("Failed to delete task:", error)
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "Failed to delete the task. Please try again.",
            })
        }
    }, [currentTask, onBack, onDelete, toast])

    // Comment handlers
    const handleAddComment = useCallback(() => {
        if (!newComment.trim()) return

        const comment = {
            id: Date.now().toString(),
            content: newComment,
            author: user,
            createdAt: new Date(),
            mentions: [],
        }

        if (isEditing && editedTask) {
            setEditedTask({
                ...editedTask,
                comments: [...(editedTask.comments || []), comment],
            })
        }

        setNewComment("")
    }, [newComment, user, isEditing, editedTask])

    // Subtask handlers
    const handleAddSubtask = useCallback(() => {
        if (!newSubtask.trim() || !editedTask) return

        const subtask = {
            id: Date.now().toString(),
            title: newSubtask,
            completed: false,
        }

        setEditedTask({
            ...editedTask,
            subtasks: [...editedTask.subtasks, subtask],
        })
        setNewSubtask("")
    }, [newSubtask, editedTask])

    const handleToggleSubtask = useCallback((subtaskId: string) => {
        if (!editedTask) return

        setEditedTask({
            ...editedTask,
            subtasks: editedTask.subtasks.map((st: any) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
        })
    }, [editedTask])

    // Label handlers
    const handleAddLabel = useCallback(() => {
        if (!newLabel.trim() || !editedTask) return

        const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"]
        const label = {
            id: Date.now().toString(),
            name: newLabel,
            color: colors[Math.floor(Math.random() * colors.length)],
        }

        setEditedTask({
            ...editedTask,
            labels: [...editedTask.labels, label],
        })
        setNewLabel("")
    }, [newLabel, editedTask])

    // Progress calculation
    const completedSubtasks = currentTask?.subtasks?.filter((st: any) => st.completed).length || 0
    const totalSubtasks = currentTask?.subtasks?.length || 0
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-6">
                        <SidebarTrigger />
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    Loading task...
                </div>
            </div>
        )
    }

    // Error state
    if (error || !currentTask) {
        return (
            <div className="flex flex-col h-full">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-6">
                        <SidebarTrigger />
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Task not found'}</p>
                        <Button onClick={onBack}>Go Back</Button>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    // Main render
    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-6">
                    <SidebarTrigger />
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">Task Details</h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Task Header */}
                    <TaskDetailHeader
                        currentTask={currentTask}
                        isEditing={isEditing}
                        editedTask={editedTask}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onFieldChange={handleFieldChange}
                        completedSubtasks={completedSubtasks}
                        totalSubtasks={totalSubtasks}
                        progressPercentage={progressPercentage}
                    />

                    {/* Tabs */}
                    <TaskDetailTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        currentTask={currentTask}
                        isEditing={isEditing}
                        editedTask={editedTask}
                        onFieldChange={handleFieldChange}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        onAddComment={handleAddComment}
                        newLabel={newLabel}
                        setNewLabel={setNewLabel}
                        onAddLabel={handleAddLabel}
                        newSubtask={newSubtask}
                        setNewSubtask={setNewSubtask}
                        onAddSubtask={handleAddSubtask}
                        onToggleSubtask={handleToggleSubtask}
                        fileInputRef={fileInputRef}
                    />

                    {/* Footer Actions */}
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isOwner && (
                                <Button variant="outline" size="sm">
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                </Button>
                            )}
                            {isOwner && (
                                <DeleteTaskModal
                                    taskTitle={currentTask?.title}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Created {currentTask?.createdAt ? new Date(currentTask.createdAt).toLocaleDateString() : ''} •
                            Updated {currentTask?.updatedAt ? new Date(currentTask.updatedAt).toLocaleDateString() : ''}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

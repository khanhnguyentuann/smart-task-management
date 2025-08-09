"use client"

import React, { useState, useRef, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card/Card"
import { Button } from "@/shared/components/ui/button/Button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Separator } from "@/shared/components/ui/separator"
import { Progress } from "@/shared/components/ui/progress"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ArrowLeft, Edit3, Save, Trash2, Archive, Share2, CalendarIcon, Clock, Tag, Paperclip, Plus, Flag, Users, Upload, Download, Eye, Send, CheckSquare, Square } from 'lucide-react'
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { TaskDetail as TaskDetailType } from "../types/task.types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog"

interface TaskDetailProps {
    taskId: string
    user: any
    onBack: () => void
    onDelete?: () => void
}

export function TaskDetail({ taskId, user, onBack, onDelete }: TaskDetailProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [newSubtask, setNewSubtask] = useState("")
    const [newLabel, setNewLabel] = useState("")
    const [activeTab, setActiveTab] = useState("details")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [task, setTask] = useState<any>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Convert simple task to detailed task format
    const convertToDetailedTask = useCallback((simpleTask: any): TaskDetailType => {
        // Map backend enums to UI format
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
                        avatar: "/placeholder.svg?height=32&width=32"
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
                        name: user.name,
                        avatar: user.avatar
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
                        avatar: "/placeholder.svg?height=32&width=32"
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
                const { apiService } = await import("@/core/services/api")
                const resp = await apiService.getTask(taskId)
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

    const handleEdit = useCallback(() => {
        setEditedTask({ ...currentTask })
        setIsEditing(true)
    }, [currentTask])

    const handleSave = useCallback(async () => {
        if (editedTask) {
            try {
                const { apiService } = await import("@/core/services/api")
                const statusMap: Record<string, string> = { TODO: 'TODO', IN_PROGRESS: 'IN_PROGRESS', DONE: 'DONE' }
                const priorityMap: Record<string, string> = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }

                const payload: any = {
                    title: editedTask.title,
                    description: editedTask.description,
                    status: statusMap[editedTask.status] || 'TODO',
                    priority: priorityMap[editedTask.priority] || 'MEDIUM',
                    dueDate: editedTask.dueDate ? new Date(editedTask.dueDate).toISOString() : undefined,
                }

                await apiService.updateTask(editedTask.id, payload)

                // Refresh task data after update
                const resp = await apiService.getTask(editedTask.id)
                const taskData = (resp as any).data || resp
                setTask(taskData)

                setIsEditing(false)
                setEditedTask(null)
            } catch (error) {
                console.error("Failed to save task:", error)
            }
        }
    }, [editedTask])

    const handleDelete = useCallback(async () => {
        if (!currentTask) return

        try {
            const { apiService } = await import("@/core/services/api")
            await apiService.deleteTask(currentTask.id)

            // Close dialog and go back
            setShowDeleteConfirm(false)
            onBack()
            onDelete?.()
        } catch (error) {
            console.error("Failed to delete task:", error)
            // You could show a toast error here
        }
    }, [currentTask, onBack, onDelete])

    const handleCancel = useCallback(() => {
        setEditedTask(null)
        setIsEditing(false)
    }, [])

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

    const getPriorityColor = useCallback((priority: string) => {
        switch (priority) {
            case "HIGH":
                return "bg-red-500 text-white"
            case "MEDIUM":
                return "bg-yellow-500 text-white"
            case "LOW":
                return "bg-green-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }, [])

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case "TODO":
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            case "DONE":
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }
    }, [])

    const completedSubtasks = currentTask?.subtasks?.filter((st: any) => st.completed).length || 0
    const totalSubtasks = currentTask?.subtasks?.length || 0
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

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

    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
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

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Task Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                    {isEditing ? (
                                        <Input
                                            value={editedTask?.title ?? ""}
                                            onChange={(e) =>
                                                setEditedTask((prev: any) => (prev ? { ...prev, title: e.target.value } : prev))
                                            }
                                            className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
                                            placeholder="Task title..."
                                        />
                                    ) : (
                                        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {currentTask?.title}
                                        </CardTitle>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                        {isEditing ? (
                                            <>
                                                <Select
                                                    value={editedTask?.priority}
                                                    onValueChange={(value) =>
                                                        setEditedTask((prev: any) => (prev ? { ...prev, priority: value } : prev))
                                                    }
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LOW">Low</SelectItem>
                                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                                        <SelectItem value="HIGH">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </>
                                        ) : (
                                            <Badge className={getPriorityColor(currentTask?.priority)}>
                                                <Flag className="h-3 w-3 mr-1" />
                                                {currentTask?.priority === "HIGH" ? "High" : currentTask?.priority === "MEDIUM" ? "Medium" : "Low"}
                                            </Badge>
                                        )}

                                        {isEditing ? (
                                            <Select
                                                value={editedTask?.status}
                                                onValueChange={(value) =>
                                                    setEditedTask((prev: any) => (prev ? { ...prev, status: value as any } : prev))
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TODO">To Do</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="DONE">Done</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge className={getStatusColor(currentTask?.status)}>
                                                {currentTask?.status === "TODO" && <Square className="h-3 w-3 mr-1" />}
                                                {currentTask?.status === "IN_PROGRESS" && <Clock className="h-3 w-3 mr-1" />}
                                                {currentTask?.status === "DONE" && <CheckSquare className="h-3 w-3 mr-1" />}
                                                {currentTask?.status === "TODO" ? "To Do" : currentTask?.status === "IN_PROGRESS" ? "In Progress" : "Done"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <EnhancedButton onClick={handleSave} size="sm">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </EnhancedButton>
                                            <EnhancedButton onClick={handleCancel} variant="outline" size="sm">
                                                Cancel
                                            </EnhancedButton>
                                        </>
                                    ) : (
                                        <>
                                            <EnhancedButton onClick={handleEdit} variant="outline" size="sm">
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Edit
                                            </EnhancedButton>
                                            <EnhancedButton variant="outline" size="sm">
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share
                                            </EnhancedButton>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar for Subtasks */}
                            {totalSubtasks > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{completedSubtasks}/{totalSubtasks} completed</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                </div>
                            )}
                        </CardHeader>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                            <TabsTrigger value="attachments">Files</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6 mt-6">
                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <Label className="flex items-center gap-2">
                                        <Edit3 className="h-4 w-4" />
                                        Description
                                    </Label>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <Textarea
                                            value={editedTask?.description ?? ""}
                                            onChange={(e) =>
                                                setEditedTask((prev: any) => (prev ? { ...prev, description: e.target.value } : prev))
                                            }
                                            placeholder="Add a description..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                    ) : (
                                        <div className="p-3 bg-muted/30 rounded-lg min-h-[100px]">
                                            {currentTask?.description ? (
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentTask.description}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No description provided</p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Assignees */}
                            <Card>
                                <CardHeader>
                                    <Label className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Assignees
                                    </Label>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {currentTask?.assignees?.map((assignee: any) => (
                                            <motion.div
                                                key={assignee.id}
                                                whileHover={{ scale: 1.05 }}
                                                className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1"
                                            >
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                                                    <AvatarFallback className="text-xs">
                                                        {assignee.name.split(" ").map((n: string) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{assignee.name}</span>
                                            </motion.div>
                                        ))}
                                        {isEditing && (
                                            <Button variant="outline" size="sm" className="rounded-full">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Due Date */}
                            <Card>
                                <CardHeader>
                                    <Label className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        Due Date
                                    </Label>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="justify-start">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editedTask?.dueDate ? format(editedTask.dueDate, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={editedTask?.dueDate || undefined}
                                                    onSelect={(date) =>
                                                        setEditedTask((prev: any) => (prev ? { ...prev, dueDate: date || null } : prev))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {currentTask?.dueDate ? (
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {format(currentTask.dueDate, "PPP")}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No due date set</span>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Labels */}
                            <Card>
                                <CardHeader>
                                    <Label className="flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Labels
                                    </Label>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {currentTask?.labels?.map((label: any) => (
                                            <Badge key={label.id} className={`${label.color} text-white`}>
                                                {label.name}
                                            </Badge>
                                        ))}
                                        {isEditing && (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={newLabel}
                                                    onChange={(e) => setNewLabel(e.target.value)}
                                                    placeholder="Add label..."
                                                    className="w-24 h-6 text-xs"
                                                    onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
                                                />
                                                <Button onClick={handleAddLabel} size="sm" variant="outline" className="h-6 px-2">
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subtasks */}
                            <Card>
                                <CardHeader>
                                    <Label className="flex items-center gap-2">
                                        <CheckSquare className="h-4 w-4" />
                                        Subtasks ({completedSubtasks}/{totalSubtasks})
                                    </Label>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {currentTask?.subtasks?.map((subtask: any) => (
                                            <motion.div
                                                key={subtask.id}
                                                whileHover={{ scale: 1.01 }}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 w-5 p-0"
                                                    onClick={() => handleToggleSubtask(subtask.id)}
                                                >
                                                    {subtask.completed ? (
                                                        <CheckSquare className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Square className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <span className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                                                    {subtask.title}
                                                </span>
                                            </motion.div>
                                        ))}
                                        {isEditing && (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={newSubtask}
                                                    onChange={(e) => setNewSubtask(e.target.value)}
                                                    placeholder="Add subtask..."
                                                    className="flex-1"
                                                    onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                                                />
                                                <Button onClick={handleAddSubtask} size="sm">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="comments" className="space-y-4 mt-6">
                            {/* Add Comment */}
                            <Card>
                                <CardHeader>
                                    <Label>Add Comment</Label>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name?.split(" ").map((n: any) => n[0]).join("") || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <Textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Add a comment... Use @ to mention someone"
                                                    rows={3}
                                                    className="resize-none"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                            e.preventDefault()
                                                            handleAddComment()
                                                        }
                                                    }}
                                                />
                                                <div className="flex justify-end">
                                                    <EnhancedButton onClick={handleAddComment} size="sm" disabled={!newComment.trim()}>
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Comment
                                                    </EnhancedButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Separator />

                            {/* Comments List */}
                            <div className="space-y-4">
                                {currentTask?.comments?.map((comment: any) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={comment.author?.avatar || "/placeholder.svg"} alt={comment.author?.name || "User"} />
                                            <AvatarFallback>
                                                {(comment.author?.name || "U").split(" ").map((n: string) => n?.[0] || "").join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{comment.author?.name || 'User'}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}
                                                </span>
                                            </div>
                                            <div className="bg-muted/30 rounded-lg p-3">
                                                <p className="text-sm leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="attachments" className="space-y-4 mt-6">
                            {/* Upload Area */}
                            <Card>
                                <CardHeader>
                                    <Label>Upload Files</Label>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                        />
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drag and drop files here, or click to browse
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                                            Choose Files
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Attachments List */}
                            <div className="space-y-2">
                                {currentTask?.attachments?.map((attachment: any) => (
                                    <motion.div
                                        key={attachment.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                                            <Paperclip className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{attachment.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {attachment.size} • Uploaded by {attachment.uploadedBy} • {format(attachment.uploadedAt, "MMM d, yyyy")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="activity" className="space-y-4 mt-6">
                            <div className="space-y-4">
                                {currentTask?.activities?.map((activity: any) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={activity.user?.avatar || "/placeholder.svg"} alt={activity.user?.name || "User"} />
                                            <AvatarFallback className="text-xs">
                                                {(activity.user?.name || "U").split(" ").map((n: string) => n?.[0] || "").join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-medium">{activity.user.name}</span>{" "}
                                                <span className="text-muted-foreground">{activity.description}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Footer Actions */}
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                            </Button>
                            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                        <AlertDialogDescription>
                                                                                         Are you sure you want to delete &quot;{currentTask?.title}&quot;? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Created {format(currentTask?.createdAt, "MMM d, yyyy")} •
                            Updated {format(currentTask?.updatedAt, "MMM d, yyyy")}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

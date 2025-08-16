"use client"

import { Card, CardHeader, CardTitle, Input, Badge, Progress, EnhancedButton } from "@/shared/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Edit3, Save, Flag, Square, Clock, CheckSquare, Share2, ChevronRight, User, Calendar, AlertTriangle } from 'lucide-react'
import { TaskDetail } from "../../types/task.types"
import { ShareTaskModal } from "../Modals/ShareTaskModal"

interface TaskDetailHeaderProps {
    currentTask: TaskDetail | null
    isEditing: boolean
    editedTask: any
    canEdit: boolean
    loading?: boolean
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    onFieldChange: (field: string, value: any) => void
    completedSubtasks: number
    totalSubtasks: number
    progressPercentage: number
    task?: any // Raw task data from backend
}

export function TaskDetailHeader({
    currentTask,
    isEditing,
    editedTask,
    canEdit,
    loading = false,
    onEdit,
    onSave,
    onCancel,
    onFieldChange,
    completedSubtasks,
    totalSubtasks,
    progressPercentage,
    task
}: TaskDetailHeaderProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
            case "MEDIUM":
                return "border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
            case "LOW":
                return "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
            default:
                return "border-gray-500 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20"
        }
    }

    const getStatusColor = (status: string) => {
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
    }

    // Helper functions for task information
    const formatTimeAgo = (date: Date | string | null) => {
        if (!date) return null
        
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date
            if (isNaN(dateObj.getTime())) return null
            
            const now = new Date()
            const diffInMs = now.getTime() - dateObj.getTime()
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
            const diffInDays = Math.floor(diffInHours / 24)
            
            if (diffInMs < 0) {
                // Future date
                const absDiffInDays = Math.abs(diffInDays)
                if (absDiffInDays === 0) return 'Today'
                if (absDiffInDays === 1) return 'Tomorrow'
                if (absDiffInDays < 7) return `in ${absDiffInDays}d`
                if (absDiffInDays < 30) return `in ${Math.floor(absDiffInDays / 7)}w`
                return `in ${Math.floor(absDiffInDays / 30)}m`
            } else {
                // Past date
                if (diffInHours < 1) return 'Just now'
                if (diffInHours < 24) return `${diffInHours}h ago`
                if (diffInDays < 7) return `${diffInDays}d ago`
                if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
                return `${Math.floor(diffInDays / 30)}m ago`
            }
        } catch (error) {
            return null
        }
    }

    const isOverdue = (dueDate: Date | string | null) => {
        if (!dueDate || currentTask?.status === 'DONE') return false
        
        try {
            const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
            if (isNaN(dateObj.getTime())) return false
            
            return dateObj < new Date()
        } catch (error) {
            return false
        }
    }

    const getTaskId = () => {
        if (!task?.id) return 'TASK-000'
        
        // Check if project is an object (from backend) or string (from frontend type)
        const projectName = typeof task.project === 'object' ? task.project?.name : task.project
        if (!projectName) return `TASK-${task.id.substring(0, 8)}`
        
        const projectPrefix = projectName.substring(0, 4).toUpperCase()
        return `${projectPrefix}-${task.id.substring(0, 8)}`
    }

    const getMainAssignee = () => {
        if (!task?.assignees || task.assignees.length === 0) return null
        return task.assignees[0] // First assignee is considered main
    }

    return (
        <Card>
            <CardHeader>
                {/* Breadcrumb */}
                {task?.project && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-2 overflow-hidden pr-16">
                        <span className="hover:text-foreground cursor-pointer truncate min-w-0 flex-1">
                            {typeof task.project === 'object' ? task.project.name : task.project}
                        </span>
                        <ChevronRight className="h-3 w-3 flex-shrink-0" />
                        <span className="hidden sm:inline">Tasks</span>
                        <ChevronRight className="h-3 w-3 flex-shrink-0 hidden sm:inline" />
                        <Badge variant="outline" className="text-xs font-mono px-2 py-0.5 h-5 truncate">
                            {getTaskId()}
                        </Badge>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                    <div className="flex-1 space-y-3 min-w-0">
                        {/* Task ID and Title */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                    {getTaskId()}
                                </Badge>
                                {currentTask?.dueDate && isOverdue(currentTask.dueDate) && currentTask?.status !== 'DONE' && (
                                    <Badge variant="destructive" className="text-xs">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Overdue
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words leading-tight text-balance">
                                {currentTask?.title}
                            </CardTitle>
                        </div>

                        {/* Task Meta Information */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground min-w-0">
                            {/* Main Assignee */}
                            {getMainAssignee() && (
                                <div className="flex items-center gap-1 min-w-0">
                                    <User className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                                        {getMainAssignee()?.user?.firstName} {getMainAssignee()?.user?.lastName}
                                    </span>
                                </div>
                            )}

                            {/* Due Date - Hide if task is DONE */}
                            {currentTask?.dueDate && currentTask?.status !== 'DONE' && (
                                <div className="flex items-center gap-1 min-w-0">
                                    <Calendar className="h-3 w-3 flex-shrink-0" />
                                    <span className={`truncate ${isOverdue(currentTask.dueDate) ? "text-red-600 dark:text-red-400" : ""}`}>
                                        {isOverdue(currentTask.dueDate) ? "Overdue" : "Due"} {formatTimeAgo(currentTask.dueDate)}
                                    </span>
                                </div>
                            )}

                            {/* Completion Time */}
                            {currentTask?.status === 'DONE' && currentTask?.updatedAt && (
                                <div className="flex items-center gap-1 min-w-0">
                                    <CheckSquare className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">Completed {formatTimeAgo(currentTask.updatedAt)}</span>
                                </div>
                            )}
                        </div>

                        {/* Priority and Status Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={getPriorityColor(currentTask?.priority || "MEDIUM")}>
                                <Flag className="h-3 w-3 mr-1" />
                                {currentTask?.priority === "HIGH" ? "High" : currentTask?.priority === "MEDIUM" ? "Medium" : "Low"}
                            </Badge>

                            <Badge className={getStatusColor(currentTask?.status || "TODO")}>
                                {currentTask?.status === "TODO" && <Square className="h-3 w-3 mr-1" />}
                                {currentTask?.status === "IN_PROGRESS" && <Clock className="h-3 w-3 mr-1" />}
                                {currentTask?.status === "DONE" && <CheckSquare className="h-3 w-3 mr-1" />}
                                {currentTask?.status === "TODO" ? "To Do" : currentTask?.status === "IN_PROGRESS" ? "In Progress" : "Done"}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isEditing ? (
                            <>
                                <EnhancedButton
                                    onClick={onSave}
                                    size="sm"
                                    disabled={loading}
                                    className="h-11 min-w-[44px] px-4 focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save'}
                                </EnhancedButton>
                                <EnhancedButton
                                    onClick={onCancel}
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                    className="h-11 min-w-[44px] px-4 focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    Cancel
                                </EnhancedButton>
                            </>
                        ) : (
                            <>
                                {canEdit && (
                                    <EnhancedButton
                                        onClick={onEdit}
                                        variant={currentTask?.status === 'DONE' ? "outline" : "default"}
                                        size="sm"
                                        disabled={loading}
                                        className="h-11 min-w-[44px] px-4 focus-visible:ring-2 focus-visible:ring-offset-2"
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit
                                    </EnhancedButton>
                                )}
                                <ShareTaskModal
                                    taskId={currentTask?.id || ""}
                                    taskTitle={currentTask?.title}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Bar for Subtasks */}
                {totalSubtasks > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Progress</span>
                            <span className="text-muted-foreground">{completedSubtasks}/{totalSubtasks} completed</span>
                        </div>
                        <Progress value={progressPercentage} className="h-1.5" />
                    </div>
                )}
            </CardHeader>
        </Card>
    )
}

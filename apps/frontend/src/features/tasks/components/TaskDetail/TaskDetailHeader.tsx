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
                return "bg-red-500 text-white"
            case "MEDIUM":
                return "bg-yellow-500 text-white"
            case "LOW":
                return "bg-green-500 text-white"
            default:
                return "bg-gray-500 text-white"
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
    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays}d ago`
        
        const diffInWeeks = Math.floor(diffInDays / 7)
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`
        
        const diffInMonths = Math.floor(diffInDays / 30)
        return `${diffInMonths}m ago`
    }

    const isOverdue = (dueDate: Date) => {
        return dueDate < new Date() && currentTask?.status !== 'DONE'
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
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <span className="hover:text-foreground cursor-pointer">
                            {typeof task.project === 'object' ? task.project.name : task.project}
                        </span>
                        <ChevronRight className="h-3 w-3" />
                        <span>Tasks</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground font-medium">{getTaskId()}</span>
                    </div>
                )}

                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                        {/* Task ID and Title */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                    {getTaskId()}
                                </Badge>
                                {currentTask?.dueDate && isOverdue(currentTask.dueDate) && (
                                    <Badge variant="destructive" className="text-xs">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Overdue
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {currentTask?.title}
                            </CardTitle>
                        </div>

                        {/* Task Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {/* Main Assignee */}
                            {getMainAssignee() && (
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>
                                        {getMainAssignee()?.user?.firstName} {getMainAssignee()?.user?.lastName}
                                    </span>
                                </div>
                            )}

                            {/* Due Date */}
                            {currentTask?.dueDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        Due {new Date(currentTask.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}

                            {/* Completion Time */}
                            {currentTask?.status === 'DONE' && currentTask?.updatedAt && (
                                <div className="flex items-center gap-1">
                                    <CheckSquare className="h-3 w-3" />
                                    <span>Completed {formatTimeAgo(new Date(currentTask.updatedAt))}</span>
                                </div>
                            )}
                        </div>

                        {/* Priority and Status Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getPriorityColor(currentTask?.priority || "MEDIUM")}>
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

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <EnhancedButton
                                    onClick={onSave}
                                    size="sm"
                                    disabled={loading}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save'}
                                </EnhancedButton>
                                <EnhancedButton
                                    onClick={onCancel}
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                >
                                    Cancel
                                </EnhancedButton>
                            </>
                        ) : (
                            <>
                                {canEdit && (
                                    <EnhancedButton
                                        onClick={onEdit}
                                        variant="outline"
                                        size="sm"
                                        disabled={loading}
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
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{completedSubtasks}/{totalSubtasks} completed</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                )}
            </CardHeader>
        </Card>
    )
}

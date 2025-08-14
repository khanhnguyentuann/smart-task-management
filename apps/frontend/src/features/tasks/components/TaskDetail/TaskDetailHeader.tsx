"use client"

import { Card, CardHeader, CardTitle, Input, Badge, Progress, EnhancedButton } from "@/shared/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Edit3, Save, Flag, Square, Clock, CheckSquare, Share2 } from 'lucide-react'
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
    progressPercentage
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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {currentTask?.title}
                        </CardTitle>

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

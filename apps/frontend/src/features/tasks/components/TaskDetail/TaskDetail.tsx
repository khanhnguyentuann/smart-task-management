"use client"

import React, { useState, useRef, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Archive, RotateCcw } from 'lucide-react'

// UI Components
import { Button, Separator, SidebarTrigger } from "@/shared/components/ui"

// Shared Hooks
import { useToast, useErrorHandler } from "@/shared/hooks"

// Feature Imports
import { useUser } from "@/features/layout"
import { getTaskPermissions } from "@/shared/lib/permissions"
import { useTaskDetail } from "../../hooks/useTaskDetail"
import { useTaskAssignees } from "../../hooks/useTaskAssignees"
import { useTaskLabels } from "../../hooks/useTaskLabels"
import { useTaskSubtasks } from "../../hooks/useTaskSubtasks"

// Types
import { TaskDetail as TaskDetailType } from "../../types/task.types"

// Components
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

    // Use task detail hook
    const { task, loading, error, updateTask, deleteTask, refresh } = useTaskDetail(taskId)

    // Use task assignees hook for assignee data and operations
    const {
        assignees,
        availableMembers,
        addAssignee,
        removeAssignee,
        isLoading: isAssigneesLoading
    } = useTaskAssignees(taskId, () => {
        // Refresh task detail when assignees change
        refresh()
    })

    // Use task labels hook for label data and operations
    const {
        labels,
        availableColors,
        createLabel,
        updateLabel,
        deleteLabel,
        isLoading: isLabelsLoading
    } = useTaskLabels(taskId, () => {
        // Refresh task detail when labels change
        refresh()
    })

    // Use task subtasks hook for subtask data and operations
    const {
        subtasks,
        progress,
        createSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtaskStatus,
        isLoading: isSubtasksLoading
    } = useTaskSubtasks(taskId, () => {
        // Refresh task detail when subtasks change
        refresh()
    })

    // State management
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [newSubtask, setNewSubtask] = useState("")
    const [activeTab, setActiveTab] = useState("details")
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const { toast } = useToast()
    const { handleError } = useErrorHandler({
        context: { component: 'TaskDetail' }
    })

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
            assignees: simpleTask.assignee,
            dueDate: (simpleTask as any).dueDate ? new Date((simpleTask as any).dueDate) : (simpleTask.deadline ? new Date(simpleTask.deadline) : null),
            createdAt: simpleTask.createdAt ? new Date(simpleTask.createdAt) : new Date(Date.now() - 604800000),
            updatedAt: simpleTask.updatedAt ? new Date(simpleTask.updatedAt) : new Date(Date.now() - 3600000)
        }
    }, [])



    const detailedTask = useMemo<TaskDetailType | null>(() => (task ? convertToDetailedTask(task) : null), [task, convertToDetailedTask])
    const currentTask = editedTask || detailedTask

    // Check task permissions using helper
    const { canEdit, canDelete } = getTaskPermissions(task, user)

    // Handler functions
    const handleEdit = useCallback(() => {
        setEditedTask({ ...currentTask })
        setIsEditing(true)
        // Auto-switch to Details tab for easier editing
        setActiveTab("details")
    }, [currentTask])

    const handleSave = useCallback(async () => {
        if (!editedTask) return

        try {
            // Validate form data
            const { updateTaskSchema } = await import('../../validation/task.schema')

            const payload = {
                title: editedTask.title?.trim(),
                description: editedTask.description?.trim() || undefined,
                status: editedTask.status,
                priority: editedTask.priority,
                dueDate: editedTask.dueDate ? new Date(editedTask.dueDate).toISOString() : null,
            }

            // Validate payload
            const validatedPayload = updateTaskSchema.parse(payload)

            // Use hook's updateTask method
            await updateTask(validatedPayload)

            setIsEditing(false)
            setEditedTask(null)

            toast({
                title: "Task Updated",
                description: "Your changes have been saved successfully.",
            })
        } catch (error: any) {
            if (error.name === 'ZodError') {
                const firstError = error.errors[0]
                toast({
                    title: "Validation Error",
                    description: firstError.message,
                    variant: "destructive"
                })
            } else {
                handleError(error)
            }
        }
    }, [editedTask, updateTask, toast, handleError])

    const handleArchive = useCallback(async () => {
        if (!task) return
        try {
            const { taskService } = await import('../../services/task.service')
            await taskService.archiveTask(task.id)
            toast({ title: 'Task archived' })
        } catch (error: any) {
            handleError(error)
        }
    }, [task, toast, handleError])

    const handleRestore = useCallback(async () => {
        if (!task) return
        try {
            const { taskService } = await import('../../services/task.service')
            await taskService.restoreTask(task.id)
            toast({ title: 'Task restored' })
        } catch (error: any) {
            handleError(error)
        }
    }, [task, toast, handleError])

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
            await deleteTask()

            toast({
                title: "Task Deleted",
                description: "The task has been successfully deleted.",
            })

            onBack()
            onDelete?.()
        } catch (error: any) {
            handleError(error)
        }
    }, [currentTask, deleteTask, onBack, onDelete, toast, handleError])

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
        if (!newSubtask.trim()) return
        createSubtask(newSubtask)
        setNewSubtask("")
    }, [newSubtask, createSubtask])

    const handleToggleSubtask = useCallback((subtaskId: string) => {
        // Find the subtask to get its current status
        const subtask = subtasks.find(st => st.id === subtaskId)
        if (subtask) {
            toggleSubtaskStatus(subtaskId, subtask.status)
        }
    }, [subtasks, toggleSubtaskStatus])



    // Progress calculation from subtasks hook
    const completedSubtasks = progress.completed
    const totalSubtasks = progress.total
    const progressPercentage = progress.percentage

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
                        canEdit={canEdit}
                        loading={loading}
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
                        canEdit={canEdit}
                        onFieldChange={handleFieldChange}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        onAddComment={handleAddComment}

                        newSubtask={newSubtask}
                        setNewSubtask={setNewSubtask}
                        onAddSubtask={handleAddSubtask}
                        onToggleSubtask={handleToggleSubtask}
                        fileInputRef={fileInputRef}
                        labels={labels}
                        availableColors={availableColors}
                        onCreateLabel={createLabel}
                        onUpdateLabel={updateLabel}
                        onDeleteLabel={deleteLabel}
                        subtasks={subtasks}
                        onDeleteSubtask={deleteSubtask}
                        assignees={assignees}
                        availableMembers={availableMembers}
                        onAddAssignee={addAssignee}
                        onRemoveAssignee={removeAssignee}
                    />

                    {/* Footer Actions */}
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {canDelete && (
                                <>
                                    <Button variant="outline" size="sm" onClick={handleArchive} disabled={loading}>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleRestore} disabled={loading}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Restore
                                    </Button>
                                </>
                            )}
                            {canDelete && (
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

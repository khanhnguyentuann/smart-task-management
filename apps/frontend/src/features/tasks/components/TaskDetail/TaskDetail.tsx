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
import { useTaskComments } from "../../hooks/useTaskComments"

// Types
import { TaskDetail as TaskDetailType, Comment } from "../../types/task.types"

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
        reorderAssignees,
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

    // Use task comments hook for comment data and operations
    const {
        comments,
        loading: commentsLoading,
        error: commentsError,
        addComment,
        updateComment,
        deleteComment,
        addReaction,
        removeReaction
    } = useTaskComments(taskId)

    // State management
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [newSubtask, setNewSubtask] = useState("")
    const [activeTab, setActiveTab] = useState("details")
    const [commentError, setCommentError] = useState<string>("")

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

    // Helper function to count total comments including nested replies
    const countTotalComments = (comments: Comment[]): number => {
        let total = 0
        for (const comment of comments) {
            total += 1 // Count current comment
            if (comment.replies && comment.replies.length > 0) {
                total += countTotalComments(comment.replies) // Recursively count replies
            }
        }
        return total
    }

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
            // Refresh task data to update UI state
            refresh()
        } catch (error: any) {
            handleError(error)
        }
    }, [task, toast, handleError, refresh])

    const handleRestore = useCallback(async () => {
        if (!task) return
        try {
            const { taskService } = await import('../../services/task.service')
            await taskService.restoreTask(task.id)
            toast({ title: 'Task restored' })
            // Refresh task data to update UI state
            refresh()
        } catch (error: any) {
            handleError(error)
        }
    }, [task, toast, handleError, refresh])

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
    const handleAddComment = useCallback(async () => {
        if (!newComment.trim()) {
            setCommentError("Comment cannot be empty")
            return
        }

        // Clear any previous errors
        setCommentError("")

        try {
            // Extract mentions from comment content (simple @userId pattern)
            const mentionMatches = newComment.match(/@(\w+)/g) || []
            const mentions = mentionMatches.map(match => match.substring(1))

            await addComment(newComment.trim(), mentions)
            setNewComment("")

            toast({
                title: "Comment Added",
                description: "Your comment has been posted successfully.",
            })
        } catch (error: any) {
            setCommentError(error.message || "Failed to add comment")
            handleError(error)
        }
    }, [newComment, addComment, toast, handleError])

    const handleEditComment = useCallback(async (commentId: string, content: string) => {
        try {
            const updatedComment = await updateComment(commentId, content)
            toast({
                title: "Comment Updated",
                description: "Your comment has been updated successfully.",
            })
            return updatedComment
        } catch (error: any) {
            handleError(error)
            throw error // Re-throw to let component handle loading state
        }
    }, [updateComment, toast, handleError])

    const handleDeleteComment = useCallback(async (commentId: string) => {
        try {
            await deleteComment(commentId)
            toast({
                title: "Comment Deleted",
                description: "Your comment has been deleted successfully.",
            })
        } catch (error: any) {
            handleError(error)
            throw error // Re-throw to let component handle loading state
        }
    }, [deleteComment, toast, handleError])

    const handleReplyComment = useCallback(async (parentCommentId: string, content: string) => {
        if (!content.trim()) {
            toast({
                title: "Reply Error",
                description: "Reply content cannot be empty.",
                variant: "destructive"
            })
            return
        }

        try {
            // Extract mentions from reply content (simple @userId pattern)
            // But exclude @username at the beginning (which is auto-added for UI)
            const mentionMatches = content.match(/@(\w+)/g) || []
            const mentions = mentionMatches
                .map(match => match.substring(1))
                .filter(mention => {
                    // Don't include mentions that are just usernames (not userIds)
                    // This filters out the auto-added @username
                    return mention.length > 3 && /^[a-zA-Z0-9]+$/.test(mention)
                })

            await addComment(content.trim(), mentions, parentCommentId)

            toast({
                title: "Reply Added",
                description: "Your reply has been posted successfully.",
            })
        } catch (error: any) {
            handleError(error)
            throw error // Re-throw to let component handle loading state
        }
    }, [addComment, toast, handleError])

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
                <div className="flex h-14 items-center gap-2 sm:gap-4 px-4 sm:px-6">
                    <SidebarTrigger />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="text-sm sm:text-base h-11 min-w-[44px] px-3 focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg sm:text-xl font-semibold">Task Details</h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
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
                        task={task}
                        onBack={onBack}
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
                        onReorderAssignees={reorderAssignees}
                        // Comments from hook
                        commentsCount={comments ? countTotalComments(comments) : 0}
                        filesCount={currentTask?.attachments?.length || 0}
                        activityCount={0}
                        commentError={commentError}
                        comments={comments}
                        commentsLoading={commentsLoading}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        onReplyComment={handleReplyComment}
                        onReaction={addReaction}
                        onRemoveReaction={removeReaction}
                        user={user}
                    />

                    {/* Footer Actions */}
                    <Separator />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left side - Archive/Restore and Delete */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Archive/Restore Button - Only show one based on current state */}
                            {canDelete && (
                                <>
                                    {task?.isArchived ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRestore}
                                            disabled={loading}
                                            className="h-11 min-w-[44px] hover:bg-green-50 hover:text-green-700 hover:border-green-300 focus-visible:ring-2 focus-visible:ring-offset-2"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Restore
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleArchive}
                                            disabled={loading}
                                            className="h-11 min-w-[44px] hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 focus-visible:ring-2 focus-visible:ring-offset-2"
                                        >
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </Button>
                                    )}

                                    {/* Danger Zone - Separated with divider */}
                                    <div className="h-px w-4 bg-border" />
                                    <DeleteTaskModal
                                        taskTitle={currentTask?.title}
                                        onDelete={handleDelete}
                                    />
                                </>
                            )}
                        </div>

                        {/* Right side - Created/Updated info */}
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            Created {currentTask?.createdAt ? new Date(currentTask.createdAt).toLocaleDateString() : ''} •
                            Updated {currentTask?.updatedAt ? new Date(currentTask.updatedAt).toLocaleDateString() : ''}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

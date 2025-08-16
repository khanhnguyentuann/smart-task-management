"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { CheckSquare, Plus, X, Edit3, Loader2, GripVertical } from 'lucide-react'

interface SubtaskListProps {
    subtasks: any[]
    isEditing?: boolean
    canEdit?: boolean
    onAddSubtask: () => void
    onToggleSubtask: (subtaskId: string) => void
    onDeleteSubtask: (subtaskId: string) => void
    newSubtask: string
    setNewSubtask: (value: string) => void
}

export function SubtaskList({
    subtasks,
    isEditing,
    canEdit,
    onAddSubtask,
    onToggleSubtask,
    onDeleteSubtask,
    newSubtask,
    setNewSubtask
}: SubtaskListProps) {
    const [editMode, setEditMode] = useState(false)
    const [inlineAddSubtask, setInlineAddSubtask] = useState(false)
    const [editingSubtask, setEditingSubtask] = useState<string | null>(null)
    const [editingSubtaskValue, setEditingSubtaskValue] = useState("")
    const [loading, setLoading] = useState(false)
    const subtaskInputRef = useRef<HTMLInputElement>(null)
    const editSubtaskRef = useRef<HTMLInputElement>(null)

    const handleAddSubtask = () => {
        if (!newSubtask.trim()) return
        setLoading(true)
        try {
            onAddSubtask()
            setInlineAddSubtask(false)
        } catch (error) {
            console.error("Failed to add subtask:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleSubtask = (subtaskId: string) => {
        try {
            onToggleSubtask(subtaskId)
        } catch (error) {
            console.error("Failed to toggle subtask:", error)
        }
    }

    const handleDeleteSubtask = (subtaskId: string) => {
        try {
            onDeleteSubtask(subtaskId)
        } catch (error) {
            console.error("Failed to delete subtask:", error)
        }
    }

    const handleInlineSubtaskAdd = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newSubtask.trim()) {
            handleAddSubtask()
        } else if (e.key === "Escape") {
            setInlineAddSubtask(false)
            setNewSubtask("")
        }
    }

    const handleSubtaskDoubleClick = (subtask: any) => {
        if (!hasEditPermission()) return
        setEditingSubtask(subtask.id)
        setEditingSubtaskValue(subtask.title)
        setTimeout(() => editSubtaskRef.current?.focus(), 0)
    }

    const handleSubtaskEdit = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (editingSubtaskValue.trim()) {
                // TODO: Implement edit subtask functionality
                console.log('Edit subtask:', editingSubtask, editingSubtaskValue.trim())
            }
            setEditingSubtask(null)
            setEditingSubtaskValue("")
        } else if (e.key === "Escape") {
            setEditingSubtask(null)
            setEditingSubtaskValue("")
        }
    }

    const handleSubtaskKeyDown = (e: React.KeyboardEvent, subtaskId: string) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault()
            handleToggleSubtask(subtaskId)
        }
    }

    const hasEditPermission = () => {
        return canEdit
    }

    const completedSubtasks = subtasks.filter(st => st.status === 'DONE').length
    const totalSubtasks = subtasks.length

    useEffect(() => {
        if (inlineAddSubtask) {
            subtaskInputRef.current?.focus()
        }
    }, [inlineAddSubtask])

    return (
        <TooltipProvider>
            <Card className="border-border hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <CheckSquare className="h-5 w-5 text-purple-500" />
                        {subtasks.length} subtasks
                        <Badge variant="secondary" className="ml-auto text-xs px-2 py-1 bg-muted">
                            {completedSubtasks}/{totalSubtasks}
                        </Badge>
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => hasEditPermission() && setEditMode(!editMode)}
                                    disabled={!hasEditPermission()}
                                    className="h-8 w-8 p-0"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            {!hasEditPermission() && (
                                <TooltipContent>
                                    <p>Bạn chỉ có thể chỉnh khi là Maintainer/Owner</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {subtasks.length === 0 && !inlineAddSubtask ? (
                        <div className="text-center py-6 text-muted-foreground">
                            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Chia nhỏ công việc thành các bước nhỏ.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {subtasks.map((subtask) => (
                                <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 group">
                                    {editMode && (
                                        <div className="cursor-grab opacity-50 group-hover:opacity-100">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                    )}
                                    <Checkbox
                                        checked={subtask.status === 'DONE'}
                                        onCheckedChange={() => handleToggleSubtask(subtask.id)}
                                        disabled={!hasEditPermission()}
                                    />
                                    {editingSubtask === subtask.id ? (
                                        <Input
                                            ref={editSubtaskRef}
                                            value={editingSubtaskValue}
                                            onChange={(e) => setEditingSubtaskValue(e.target.value)}
                                            onKeyDown={handleSubtaskEdit}
                                            onBlur={() => setEditingSubtask(null)}
                                            className="flex-1"
                                        />
                                    ) : (
                                        <span
                                            className={`flex-1 text-sm cursor-pointer ${subtask.status === 'DONE' ? "line-through text-muted-foreground" : ""
                                                }`}
                                            onDoubleClick={() => handleSubtaskDoubleClick(subtask)}
                                            onKeyDown={(e) => handleSubtaskKeyDown(e, subtask.id)}
                                            tabIndex={0}
                                        >
                                            {subtask.title}
                                        </span>
                                    )}
                                    {editMode && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteSubtask(subtask.id)}
                                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {editMode && (
                        <>
                            {inlineAddSubtask ? (
                                <Input
                                    ref={subtaskInputRef}
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyDown={handleInlineSubtaskAdd}
                                    placeholder="Nhập tiêu đề subtask..."
                                    className="w-full"
                                />
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setInlineAddSubtask(true)}
                                    className="w-full justify-start gap-2 border-dashed hover:bg-accent hover:border-solid transition-all duration-200 bg-transparent"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add subtask
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

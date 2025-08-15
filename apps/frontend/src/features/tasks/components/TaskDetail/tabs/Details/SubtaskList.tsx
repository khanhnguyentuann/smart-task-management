"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label as UI_Label } from "@/shared/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { CheckSquare, Plus, X, Edit3 } from 'lucide-react'

interface SubtaskListProps {
    subtasks: any[]
    isEditing?: boolean
    canEdit?: boolean
    onAddSubtask?: (subtask: any) => void
    onToggleSubtask?: (subtaskId: string) => void
    onDeleteSubtask?: (subtaskId: string) => void
}

export function SubtaskList({
    subtasks,
    isEditing,
    canEdit,
    onAddSubtask,
    onToggleSubtask,
    onDeleteSubtask
}: SubtaskListProps) {
    const [editMode, setEditMode] = useState(false)
    const [newSubtask, setNewSubtask] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAddSubtask = () => {
        if (!newSubtask.trim() || !onAddSubtask) return
        setLoading(true)
        try {
            const newSubtaskData = {
                id: Date.now().toString(),
                title: newSubtask.trim(),
                completed: false
            }
            onAddSubtask(newSubtaskData)
            setNewSubtask("")
        } catch (error) {
            console.error("Failed to add subtask:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleSubtask = (subtaskId: string) => {
        if (!onToggleSubtask) return
        try {
            onToggleSubtask(subtaskId)
        } catch (error) {
            console.error("Failed to toggle subtask:", error)
        }
    }

    const handleDeleteSubtask = (subtaskId: string) => {
        if (!onDeleteSubtask) return
        try {
            onDeleteSubtask(subtaskId)
        } catch (error) {
            console.error("Failed to delete subtask:", error)
        }
    }

    const completedSubtasks = subtasks.filter(st => st.completed).length
    const totalSubtasks = subtasks.length

    return (
        <Card className="border-border hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <CheckSquare className="h-5 w-5 text-purple-500" />
                    Subtasks
                    <Badge variant="secondary" className="ml-auto text-xs px-2 py-1 bg-muted">
                        {completedSubtasks}/{totalSubtasks}
                    </Badge>
                    {/* Edit Button */}
                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode(!editMode)}
                            className="h-6 w-6 p-0 ml-2"
                        >
                            <Edit3 className="h-3 w-3" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Subtask List */}
                <div className="space-y-2">
                    {subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <Checkbox
                                checked={subtask.completed}
                                onCheckedChange={() => handleToggleSubtask(subtask.id)}
                                disabled={!editMode}
                            />
                            <span className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                                {subtask.title}
                            </span>
                            {/* Remove Button */}
                            {editMode && canEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSubtask(subtask.id)}
                                    className="h-6 w-6 p-0 hover:bg-destructive/10"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                {editMode && canEdit && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 border-dashed hover:bg-accent hover:border-solid transition-all duration-200 bg-transparent"
                            >
                                <Plus className="h-4 w-4" />
                                Add subtask
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Subtask</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <UI_Label htmlFor="subtaskTitle">Subtask Title</UI_Label>
                                    <Input
                                        id="subtaskTitle"
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        placeholder="Enter subtask title"
                                    />
                                </div>
                                <Button onClick={handleAddSubtask} className="w-full" disabled={loading}>
                                    Add Subtask
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Empty State */}
                {subtasks.length === 0 && !editMode && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                        No subtasks yet. Add subtasks to break down this task.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

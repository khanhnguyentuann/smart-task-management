"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { CheckSquare } from 'lucide-react'
import { SubtaskItem } from "./SubtaskItem"
import { SubtaskEditor } from "./SubtaskEditor"

interface SubtaskListProps {
    subtasks?: Array<{
        id: string
        title: string
        completed: boolean
    }>
    isEditing?: boolean
    newSubtask: string
    setNewSubtask: (value: string) => void
    onAddSubtask: () => void
    onToggleSubtask: (subtaskId: string) => void
    onDeleteSubtask?: (subtaskId: string) => void
}

export function SubtaskList({
    subtasks = [],
    isEditing,
    newSubtask,
    setNewSubtask,
    onAddSubtask,
    onToggleSubtask,
    onDeleteSubtask
}: SubtaskListProps) {
    const completedSubtasks = subtasks.filter(st => st.completed).length
    const totalSubtasks = subtasks.length

    return (
        <Card>
            <CardHeader>
                <Label className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                </Label>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {subtasks.map((subtask) => (
                        <SubtaskItem
                            key={subtask.id}
                            subtask={subtask}
                            onToggle={onToggleSubtask}
                            onDelete={onDeleteSubtask}
                            isEditing={isEditing}
                        />
                    ))}

                    {subtasks.length === 0 && !isEditing && (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No subtasks yet. Add subtasks to break down this task.
                        </div>
                    )}

                    {isEditing && (
                        <SubtaskEditor
                            newSubtask={newSubtask}
                            setNewSubtask={setNewSubtask}
                            onAddSubtask={onAddSubtask}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

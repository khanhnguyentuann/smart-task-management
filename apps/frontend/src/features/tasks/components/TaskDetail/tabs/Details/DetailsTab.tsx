"use client"

import { DetailsForm } from "./DetailsForm"
import { LabelsSection } from "./LabelsSection"
import { SubtaskList } from "./SubtaskList"
import { AssigneeManager } from "../../AssigneeManager"
import { TaskDetail } from "../../../../types/task.types"

interface DetailsTabProps {
    currentTask: TaskDetail | null
    isEditing: boolean
    editedTask: any
    canEdit: boolean
    onFieldChange: (field: string, value: any) => void
    newLabel: string
    setNewLabel: (value: string) => void
    onAddLabel: () => void
    newSubtask: string
    setNewSubtask: (value: string) => void
    onAddSubtask: () => void
    onToggleSubtask: (subtaskId: string) => void
}

export function DetailsTab({
    currentTask,
    isEditing,
    editedTask,
    canEdit,
    onFieldChange,
    newLabel,
    setNewLabel,
    onAddLabel,
    newSubtask,
    setNewSubtask,
    onAddSubtask,
    onToggleSubtask
}: DetailsTabProps) {
    const handleDeleteLabel = (labelId: string) => {
        // TODO: Implement delete label functionality
        console.log('Delete label:', labelId)
    }

    const handleDeleteSubtask = (subtaskId: string) => {
        // TODO: Implement delete subtask functionality
        console.log('Delete subtask:', subtaskId)
    }

    return (
        <div className="space-y-6 mt-6">
            <DetailsForm
                currentTask={currentTask}
                isEditing={isEditing}
                editedTask={editedTask}
                onFieldChange={onFieldChange}
            />

            <LabelsSection
                labels={currentTask?.labels}
                isEditing={isEditing}
                newLabel={newLabel}
                setNewLabel={setNewLabel}
                onAddLabel={onAddLabel}
                onDeleteLabel={handleDeleteLabel}
            />

            <AssigneeManager
                taskId={currentTask?.id || ""}
                canEdit={canEdit}
            />

            <SubtaskList
                subtasks={currentTask?.subtasks}
                isEditing={isEditing}
                newSubtask={newSubtask}
                setNewSubtask={setNewSubtask}
                onAddSubtask={onAddSubtask}
                onToggleSubtask={onToggleSubtask}
                onDeleteSubtask={handleDeleteSubtask}
            />
        </div>
    )
}

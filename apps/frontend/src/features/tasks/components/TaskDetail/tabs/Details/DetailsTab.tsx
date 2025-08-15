"use client"

import { DetailsForm } from "./DetailsForm"
import { LabelsSection } from "./LabelsSection"
import { SubtaskList } from "./SubtaskList"
import { AssigneeManager } from "./AssigneeManager"
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
    labels: any[]
    onDeleteLabel: (labelId: string) => void
    subtasks: any[]
    onDeleteSubtask: (subtaskId: string) => void
    assignees: any[]
    availableMembers: any[]
    onAddAssignee: (userId: string) => void
    onRemoveAssignee: (userId: string) => void
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
    onToggleSubtask,
    labels,
    onDeleteLabel,
    subtasks,
    onDeleteSubtask,
    assignees,
    availableMembers,
    onAddAssignee,
    onRemoveAssignee
}: DetailsTabProps) {
    const handleDeleteLabel = (labelId: string) => {
        // TODO: Implement delete label functionality
    }

    const handleDeleteSubtask = (subtaskId: string) => {
        // TODO: Implement delete subtask functionality
    }

    return (
        <div className="space-y-6 mt-6">
            <DetailsForm
                currentTask={currentTask}
                isEditing={isEditing}
                editedTask={editedTask}
                onFieldChange={onFieldChange}
            />

            <AssigneeManager
                assignees={assignees}
                availableMembers={availableMembers}
                canEdit={canEdit}
                onAddAssignee={onAddAssignee}
                onRemoveAssignee={onRemoveAssignee}
            />

            <LabelsSection
                labels={labels}
                isEditing={isEditing}
                canEdit={canEdit}
                onAddLabel={onAddLabel}
                onDeleteLabel={onDeleteLabel}
            />

            <SubtaskList
                subtasks={subtasks}
                isEditing={isEditing}
                canEdit={canEdit}
                onAddSubtask={onAddSubtask}
                onToggleSubtask={onToggleSubtask}
                onDeleteSubtask={onDeleteSubtask}
            />
        </div>
    )
}

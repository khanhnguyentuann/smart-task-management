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
    availableColors?: string[]
    onCreateLabel: (name: string, color?: string) => void
    onUpdateLabel: (labelId: string, data: any) => void
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
    onReorderAssignees?: (assignees: any[]) => void
}

export function DetailsTab({
    currentTask,
    isEditing,
    editedTask,
    canEdit,
    onFieldChange,
    newSubtask,
    setNewSubtask,
    onAddSubtask,
    onToggleSubtask,
    labels,
    availableColors,
    onCreateLabel,
    onUpdateLabel,
    onDeleteLabel,
    subtasks,
    onDeleteSubtask,
    assignees,
    availableMembers,
    onAddAssignee,
    onRemoveAssignee,
    onReorderAssignees
}: DetailsTabProps) {


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
                onReorderAssignees={onReorderAssignees}
            />

            <LabelsSection
                labels={labels}
                availableColors={availableColors}
                isEditing={isEditing}
                canEdit={canEdit}
                onCreateLabel={onCreateLabel}
                onUpdateLabel={onUpdateLabel}
                onDeleteLabel={onDeleteLabel}
            />

            <SubtaskList
                subtasks={subtasks}
                isEditing={isEditing}
                canEdit={canEdit}
                onAddSubtask={onAddSubtask}
                onToggleSubtask={onToggleSubtask}
                onDeleteSubtask={onDeleteSubtask}
                newSubtask={newSubtask}
                setNewSubtask={setNewSubtask}
            />
        </div>
    )
}

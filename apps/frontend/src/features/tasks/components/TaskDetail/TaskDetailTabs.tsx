"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui"
import { DetailsTab } from "./tabs/Details/DetailsTab"
import { CommentsTab } from "./tabs/Comments/CommentsTab"
import { FilesTab } from "./tabs/Files/FilesTab"
import { ActivityTab } from "./tabs/Activity/ActivityTab"
import { TaskDetail } from "../../types/task.types"

interface TaskDetailTabsProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    currentTask: TaskDetail | null
    isEditing: boolean
    editedTask: any
    canEdit: boolean
    onFieldChange: (field: string, value: any) => void
    newComment: string
    setNewComment: (value: string) => void
    onAddComment: () => void
    labels: any[]
    availableColors?: string[]
    onCreateLabel: (name: string, color?: string) => void
    onUpdateLabel: (labelId: string, data: any) => void
    onDeleteLabel: (labelId: string) => void
    newSubtask: string
    setNewSubtask: (value: string) => void
    onAddSubtask: () => void
    onToggleSubtask: (subtaskId: string) => void
    fileInputRef: React.RefObject<HTMLInputElement | null>
    subtasks: any[]
    onDeleteSubtask: (subtaskId: string) => void
    assignees: any[]
    availableMembers: any[]
    onAddAssignee: (userId: string) => void
    onRemoveAssignee: (userId: string) => void
}

export function TaskDetailTabs({
    activeTab,
    setActiveTab,
    currentTask,
    isEditing,
    editedTask,
    canEdit,
    onFieldChange,
    newComment,
    setNewComment,
    onAddComment,
    newSubtask,
    setNewSubtask,
    onAddSubtask,
    onToggleSubtask,
    fileInputRef,
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
    onRemoveAssignee
}: TaskDetailTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="attachments">Files</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <DetailsTab
                    currentTask={currentTask}
                    isEditing={isEditing}
                    editedTask={editedTask}
                    canEdit={canEdit}
                    onFieldChange={onFieldChange}
                    labels={labels}
                    availableColors={availableColors}
                    onCreateLabel={onCreateLabel}
                    onUpdateLabel={onUpdateLabel}
                    onDeleteLabel={onDeleteLabel}
                    newSubtask={newSubtask}
                    setNewSubtask={setNewSubtask}
                    onAddSubtask={onAddSubtask}
                    onToggleSubtask={onToggleSubtask}
                    subtasks={subtasks}
                    onDeleteSubtask={onDeleteSubtask}
                    assignees={assignees}
                    availableMembers={availableMembers}
                    onAddAssignee={onAddAssignee}
                    onRemoveAssignee={onRemoveAssignee}
                />
            </TabsContent>

            <TabsContent value="comments">
                <CommentsTab
                    currentTask={currentTask}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={onAddComment}
                />
            </TabsContent>

            <TabsContent value="attachments">
                <FilesTab
                    currentTask={currentTask}
                    fileInputRef={fileInputRef}
                />
            </TabsContent>

            <TabsContent value="activity">
                <ActivityTab
                    currentTask={currentTask}
                />
            </TabsContent>
        </Tabs>
    )
}

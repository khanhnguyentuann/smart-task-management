"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
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
    user: any
    onFieldChange: (field: string, value: any) => void
    newComment: string
    setNewComment: (value: string) => void
    onAddComment: () => void
    newLabel: string
    setNewLabel: (value: string) => void
    onAddLabel: () => void
    newSubtask: string
    setNewSubtask: (value: string) => void
    onAddSubtask: () => void
    onToggleSubtask: (subtaskId: string) => void
    fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function TaskDetailTabs({
    activeTab,
    setActiveTab,
    currentTask,
    isEditing,
    editedTask,
    user,
    onFieldChange,
    newComment,
    setNewComment,
    onAddComment,
    newLabel,
    setNewLabel,
    onAddLabel,
    newSubtask,
    setNewSubtask,
    onAddSubtask,
    onToggleSubtask,
    fileInputRef
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
                    onFieldChange={onFieldChange}
                    newLabel={newLabel}
                    setNewLabel={setNewLabel}
                    onAddLabel={onAddLabel}
                    newSubtask={newSubtask}
                    setNewSubtask={setNewSubtask}
                    onAddSubtask={onAddSubtask}
                    onToggleSubtask={onToggleSubtask}
                />
            </TabsContent>

            <TabsContent value="comments">
                <CommentsTab
                    currentTask={currentTask}
                    user={user}
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

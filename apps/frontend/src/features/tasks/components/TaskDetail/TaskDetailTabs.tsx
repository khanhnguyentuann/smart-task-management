"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger, Badge } from "@/shared/components/ui"
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
    onReorderAssignees?: (assignees: any[]) => void
    // Mock data for counts - in real app, these would come from props
    commentsCount?: number
    filesCount?: number
    activityCount?: number
    commentError?: string
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
    onRemoveAssignee,
    onReorderAssignees,
    commentsCount = 0,
    filesCount = 0,
    activityCount = 0,
    commentError
}: TaskDetailTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border shadow-sm rounded-lg p-1">
                <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80"
                >
                    Details
                </TabsTrigger>
                <TabsTrigger 
                    value="comments" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 relative"
                >
                    Comments
                    {commentsCount > 0 && (
                        <Badge 
                            variant="secondary" 
                            className="ml-2 h-5 w-5 rounded-full p-0 text-xs font-medium bg-red-500 text-white data-[state=active]:bg-red-400 data-[state=active]:text-white flex items-center justify-center"
                        >
                            {commentsCount}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger 
                    value="attachments" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 relative"
                >
                    Files
                    {filesCount > 0 && (
                        <Badge 
                            variant="secondary" 
                            className="ml-2 h-5 w-5 rounded-full p-0 text-xs font-medium bg-red-500 text-white data-[state=active]:bg-red-400 data-[state=active]:text-white flex items-center justify-center"
                        >
                            {filesCount}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 relative"
                >
                    Activity
                    {activityCount > 0 && (
                        <Badge 
                            variant="secondary" 
                            className="ml-2 h-5 w-5 rounded-full p-0 text-xs font-medium bg-red-500 text-white data-[state=active]:bg-red-400 data-[state=active]:text-white flex items-center justify-center"
                        >
                            {activityCount}
                        </Badge>
                    )}
                </TabsTrigger>
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
                    onReorderAssignees={onReorderAssignees}
                />
            </TabsContent>

            <TabsContent value="comments">
                <CommentsTab
                    currentTask={currentTask}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={onAddComment}
                    commentError={commentError}
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

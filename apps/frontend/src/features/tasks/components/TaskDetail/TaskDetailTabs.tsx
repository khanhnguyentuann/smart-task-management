"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger, Badge } from "@/shared/components/ui"
import { DetailsTab } from "./tabs/Details/DetailsTab"
import { CommentsTab } from "./tabs/Comments/CommentsTab"
import { FilesTab } from "./tabs/Files/FilesTab"
import { ActivityTab } from "./tabs/Activity/ActivityTab"
import { TaskDetail, Comment } from "../../types/task.types"
import type { User } from "@/shared/lib/types"

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
    // Comments data
    commentsCount?: number
    filesCount?: number
    activityCount?: number
    commentError?: string
    comments?: Comment[]
    commentsLoading?: boolean
    onEditComment?: (commentId: string, content: string) => Promise<Comment | undefined>
    onDeleteComment?: (commentId: string) => Promise<void>
    onReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onRemoveReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    user?: User
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
    commentError,
    comments,
    commentsLoading = false,
    onEditComment,
    onDeleteComment,
    onReaction,
    onRemoveReaction,
    user
}: TaskDetailTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="relative">
                <TabsList className="flex w-full bg-muted/50 border border-border shadow-sm rounded-lg p-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 text-xs sm:text-sm flex-shrink-0 snap-start focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    Details
                </TabsTrigger>
                <TabsTrigger 
                    value="comments" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 relative text-xs sm:text-sm flex-shrink-0 snap-start focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    Comments
                    {commentsCount > 0 && (
                        <Badge 
                            variant="secondary" 
                            className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs font-medium bg-white/10 text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background flex items-center justify-center"
                            aria-label={`${commentsCount} comments`}
                        >
                            {commentsCount}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger 
                    value="attachments" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 relative text-xs sm:text-sm flex-shrink-0 snap-start focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    Files
                    {filesCount > 0 && (
                        <Badge 
                            variant="secondary" 
                            className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs font-medium bg-white/10 text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background flex items-center justify-center"
                            aria-label={`${filesCount} files`}
                        >
                            {filesCount}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold font-medium transition-all duration-200 hover:bg-muted/80 relative text-xs sm:text-sm flex-shrink-0 snap-start focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    Activity
                    {activityCount > 0 && (
                        <Badge 
                            variant="secondary" 
                            className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs font-medium bg-white/10 text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background flex items-center justify-center"
                            aria-label={`${activityCount} activities`}
                        >
                            {activityCount}
                        </Badge>
                    )}
                </TabsTrigger>
                </TabsList>
                {/* Fade indicators for scroll */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>

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
                    comments={comments}
                    commentsLoading={commentsLoading}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    onReaction={onReaction}
                    onRemoveReaction={onRemoveReaction}
                    user={user}
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

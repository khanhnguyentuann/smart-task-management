"use client"

import { Separator } from "@/shared/components/ui/separator"
import { CommentEditor } from "./CommentEditor"
import { CommentList } from "./CommentList"
import { TaskDetail } from "../../../../types/task.types"
import { useUser } from "@/features/layout"

interface CommentsTabProps {
    currentTask: TaskDetail | null
    newComment: string
    setNewComment: (value: string) => void
    onAddComment: () => void
    isSubmittingComment?: boolean
}

export function CommentsTab({
    currentTask,
    newComment,
    setNewComment,
    onAddComment,
    isSubmittingComment = false
}: CommentsTabProps) {
    const { user } = useUser()
    const handleEditComment = (commentId: string) => {
        // TODO: Implement edit comment functionality
        console.log('Edit comment:', commentId)
    }

    const handleDeleteComment = (commentId: string) => {
        // TODO: Implement delete comment functionality
        console.log('Delete comment:', commentId)
    }

    const handleReplyToComment = (commentId: string) => {
        // TODO: Implement reply to comment functionality
        console.log('Reply to comment:', commentId)
    }

    return (
        <div className="space-y-4 mt-6">
            <CommentEditor
                user={user}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={onAddComment}
                isSubmitting={isSubmittingComment}
            />

            <Separator />

            <CommentList
                comments={currentTask?.comments}
                currentUserId={user?.id}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onReplyToComment={handleReplyToComment}
            />
        </div>
    )
}

"use client"

import { CommentItem } from "./CommentItem"
import { TaskDetail } from "../../../../types/task.types"

interface CommentListProps {
    comments?: TaskDetail['comments']
    currentUserId?: string
    onEditComment?: (commentId: string) => void
    onDeleteComment?: (commentId: string) => void
    onReplyToComment?: (commentId: string) => void
}

export function CommentList({
    comments,
    currentUserId,
    onEditComment,
    onDeleteComment,
    onReplyToComment
}: CommentListProps) {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">
                    No comments yet. Be the first to comment on this task!
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                    onReply={onReplyToComment}
                />
            ))}
        </div>
    )
}

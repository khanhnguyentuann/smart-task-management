"use client"

import { CommentItem } from "./CommentItem"
import { TaskDetail, Comment, CommentAttachment } from "../../../../types/task.types"
import { MessageSquare, AtSign, Hash, Bold, Italic, List } from 'lucide-react'

interface CommentListProps {
    comments?: TaskDetail['comments']
    currentUserId?: string
    onEditComment?: (commentId: string, content: string) => Promise<Comment | undefined>
    onDeleteComment?: (commentId: string) => Promise<void>
    onReplyToComment?: (commentId: string) => void
    onQuoteComment?: (commentId: string) => void
    onReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onRemoveReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onDownloadAttachment?: (attachment: CommentAttachment) => void
}

export function CommentList({
    comments,
    currentUserId,
    onEditComment,
    onDeleteComment,
    onReplyToComment,
    onQuoteComment,
    onReaction,
    onRemoveReaction,
    onDownloadAttachment
}: CommentListProps) {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                            No comments yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Be the first to start the conversation! Share your thoughts, ask questions, or provide updates.
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 max-w-md">
                        <h4 className="text-sm font-medium text-foreground mb-3">💡 Pro Tips:</h4>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <AtSign className="h-3 w-3" />
                                <span>Use @mention to tag team members</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3" />
                                <span>Add #hashtags for easy searching</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bold className="h-3 w-3" />
                                <span>**Bold** and *italic* text supported</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <List className="h-3 w-3" />
                                <span>Create lists with - or 1. format</span>
                            </div>
                        </div>
                    </div>
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
                    onQuote={onQuoteComment}
                    onReaction={onReaction}
                    onRemoveReaction={onRemoveReaction}
                    onDownloadAttachment={onDownloadAttachment}
                />
            ))}
        </div>
    )
}

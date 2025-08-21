"use client"

import { useState, useCallback } from "react"
import { CommentEditor } from "./CommentEditor"
import { CommentItem } from "./CommentItem"
import { Comment } from "../../../../types/task.types"
import type { User } from "@/shared/lib/types"

interface CommentsTabProps {
    comments?: Comment[]
    commentsLoading?: boolean
    onEditComment?: (commentId: string, content: string) => Promise<Comment | undefined>
    onDeleteComment?: (commentId: string) => Promise<void>
    onReplyComment?: (parentCommentId: string, content: string) => Promise<void>
    onReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onRemoveReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onDownloadAttachment?: (attachment: any) => void
    onAddComment?: () => void
    newComment?: string
    setNewComment?: (value: string) => void
    commentError?: string
    user?: User
}

export function CommentsTab({
    comments = [],
    commentsLoading = false,
    onEditComment,
    onDeleteComment,
    onReplyComment,
    onReaction,
    onRemoveReaction,
    onDownloadAttachment,
    onAddComment,
    newComment: externalNewComment,
    setNewComment: externalSetNewComment,
    commentError: externalCommentError,
    user
}: CommentsTabProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)
    const [localCommentError, setLocalCommentError] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [quotingComment, setQuotingComment] = useState<Comment | null>(null)

    // Use external error if provided, otherwise use local error
    const commentError = externalCommentError ?? localCommentError

    // Use external state if provided, otherwise use local state
    const [localNewComment, setLocalNewComment] = useState("")
    const newComment = externalNewComment ?? localNewComment
    const setNewComment = externalSetNewComment ?? setLocalNewComment

    const handleAddComment = useCallback(() => {
        if (newComment.trim() || selectedFiles.length > 0) {
            if (onAddComment) {
                onAddComment()
            }
            setSelectedFiles([])
            setReplyingTo(null)
            setQuotingComment(null)
        }
    }, [newComment, selectedFiles, onAddComment])

    const handleFilesChange = useCallback((files: File[]) => {
        setSelectedFiles(files)
    }, [])

    const handleReplyToComment = useCallback((commentId: string) => {
        const comment = comments?.find(c => c.id === commentId)
        if (comment) {
            setReplyingTo(commentId)
            setQuotingComment(null)
        }
    }, [comments])

    const handleQuoteComment = useCallback((commentId: string) => {
        const comment = comments?.find(c => c.id === commentId)
        if (comment) {
            setQuotingComment(comment)
            setReplyingTo(null)
        }
    }, [comments])

    const handleCancelReply = useCallback(() => {
        setReplyingTo(null)
    }, [])

    const handleCancelQuote = useCallback(() => {
        setQuotingComment(null)
    }, [])

    if (commentsLoading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="h-8 w-8 bg-muted rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-1/3"></div>
                                    <div className="h-20 bg-muted rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {user && (
                <CommentEditor
                    user={user}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={handleAddComment}
                    isSubmitting={isSubmittingComment}
                    error={commentError}
                    selectedFiles={selectedFiles}
                    onFilesChange={handleFilesChange}
                    replyingTo={replyingTo}
                    quotedComment={quotingComment}
                    onCancelReply={handleCancelReply}
                    onCancelQuote={handleCancelQuote}
                    placeholder="Add a comment..."
                />
            )}

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No comments yet. Be the first to add a comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={user?.id}
                            onEdit={onEditComment}
                            onDelete={onDeleteComment}
                            onReply={onReplyComment}
                            onQuote={handleQuoteComment}
                            onReaction={onReaction}
                            onRemoveReaction={onRemoveReaction}
                            onDownloadAttachment={onDownloadAttachment}
                            replyLevel={0}
                            allComments={comments}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

import { useCallback, useState, useEffect } from 'react'
import { commentService } from '../services'
import type { Comment } from '../types'

export function useTaskComments(taskId: string) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Helper function to update comment in nested structure
    const updateCommentInNestedStructure = (comments: Comment[], commentId: string, updatedComment: Comment): Comment[] => {
        return comments.map(comment => {
            if (comment.id === commentId) {
                return updatedComment
            }
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateCommentInNestedStructure(comment.replies, commentId, updatedComment)
                }
            }
            return comment
        })
    }

    // Helper function to delete comment in nested structure
    const deleteCommentInNestedStructure = (comments: Comment[], commentId: string): Comment[] => {
        return comments.map(comment => {
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: deleteCommentInNestedStructure(comment.replies, commentId)
                }
            }
            return comment
        }).filter(comment => comment.id !== commentId)
    }

    const fetchComments = useCallback(async () => {
        if (!taskId) return

        setLoading(true)
        setError(null)
        try {
            const data = await commentService.getTaskComments(taskId)
            setComments(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load comments')
        } finally {
            setLoading(false)
        }
    }, [taskId])

    const addComment = useCallback(async (content: string, mentions?: string[], parentId?: string, quotedCommentId?: string) => {
        if (!taskId) return

        try {
            const newComment = await commentService.addComment(taskId, content, mentions, parentId, quotedCommentId)

            // Refresh comments to get the updated structure with replies
            await fetchComments()

            return newComment
        } catch (err: any) {
            setError(err.message || 'Failed to add comment')
            throw err
        }
    }, [taskId, fetchComments])

    const updateComment = useCallback(async (commentId: string, content: string, mentions?: string[]) => {
        if (!taskId) return

        try {
            const updatedComment = await commentService.updateComment(taskId, commentId, content, mentions)
            setComments(prev => updateCommentInNestedStructure(prev, commentId, updatedComment))
            return updatedComment
        } catch (err: any) {
            setError(err.message || 'Failed to update comment')
            throw err
        }
    }, [taskId])

    const deleteComment = useCallback(async (commentId: string) => {
        if (!taskId) return

        try {
            await commentService.deleteComment(taskId, commentId)
            setComments(prev => deleteCommentInNestedStructure(prev, commentId))
        } catch (err: any) {
            setError(err.message || 'Failed to delete comment')
            throw err
        }
    }, [taskId])

    const addReaction = useCallback(async (commentId: string, emoji: string) => {
        if (!taskId) return

        try {
            const updatedComment = await commentService.addReaction(taskId, commentId, emoji)
            setComments(prev => updateCommentInNestedStructure(prev, commentId, updatedComment))
            return updatedComment
        } catch (err: any) {
            setError(err.message || 'Failed to add reaction')
            throw err
        }
    }, [taskId])

    const removeReaction = useCallback(async (commentId: string, emoji: string) => {
        if (!taskId) return

        try {
            const updatedComment = await commentService.removeReaction(taskId, commentId, emoji)
            setComments(prev => updateCommentInNestedStructure(prev, commentId, updatedComment))
            return updatedComment
        } catch (err: any) {
            setError(err.message || 'Failed to remove reaction')
            throw err
        }
    }, [taskId])

    // Legacy methods for backward compatibility
    const likeComment = useCallback(async (commentId: string) => {
        return addReaction(commentId, '❤️')
    }, [addReaction])

    const unlikeComment = useCallback(async (commentId: string) => {
        return removeReaction(commentId, '❤️')
    }, [removeReaction])

    // Auto-fetch on mount or taskId change
    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    return {
        comments,
        loading,
        error,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        addReaction,
        removeReaction,
        likeComment,
        unlikeComment,
        refresh: fetchComments
    }
}

import { useCallback, useState, useEffect } from 'react'
import { commentService } from '../services'
import type { Comment } from '../types'

export function useTaskComments(taskId: string) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    const addComment = useCallback(async (content: string, mentions?: string[]) => {
        if (!taskId) return
        
        try {
            const newComment = await commentService.addComment(taskId, content, mentions)
            setComments(prev => [newComment, ...prev])
            return newComment
        } catch (err: any) {
            setError(err.message || 'Failed to add comment')
            throw err
        }
    }, [taskId])

    const updateComment = useCallback(async (commentId: string, content: string) => {
        if (!taskId) return
        
        try {
            const updatedComment = await commentService.updateComment(taskId, commentId, content)
            setComments(prev => prev.map(comment => 
                comment.id === commentId ? updatedComment : comment
            ))
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
            setComments(prev => prev.filter(comment => comment.id !== commentId))
        } catch (err: any) {
            setError(err.message || 'Failed to delete comment')
            throw err
        }
    }, [taskId])

    const likeComment = useCallback(async (commentId: string) => {
        if (!taskId) return
        
        try {
            const updatedComment = await commentService.likeComment(taskId, commentId)
            setComments(prev => prev.map(comment => 
                comment.id === commentId ? updatedComment : comment
            ))
            return updatedComment
        } catch (err: any) {
            setError(err.message || 'Failed to like comment')
            throw err
        }
    }, [taskId])

    const unlikeComment = useCallback(async (commentId: string) => {
        if (!taskId) return
        
        try {
            const updatedComment = await commentService.unlikeComment(taskId, commentId)
            setComments(prev => prev.map(comment => 
                comment.id === commentId ? updatedComment : comment
            ))
            return updatedComment
        } catch (err: any) {
            setError(err.message || 'Failed to unlike comment')
            throw err
        }
    }, [taskId])

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
        likeComment,
        unlikeComment,
        refresh: fetchComments
    }
}

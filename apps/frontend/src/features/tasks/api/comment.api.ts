/*
    API layer: Comments for tasks
*/
import { apiClient } from '@/core/services/api-client'
import type { Comment, CreateCommentPayload, UpdateCommentPayload, AddCommentReactionPayload, RemoveCommentReactionPayload } from '../types'

class CommentApi {
    async getTaskComments(taskId: string): Promise<Comment[]> {
        const response = await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`)
        return response
    }

    async addComment(taskId: string, payload: CreateCommentPayload): Promise<Comment> {
        return apiClient.post<Comment>(`/tasks/${taskId}/comments`, payload)
    }

    async updateComment(taskId: string, commentId: string, payload: UpdateCommentPayload): Promise<Comment> {
        return apiClient.put<Comment>(`/tasks/${taskId}/comments/${commentId}`, payload)
    }

    async deleteComment(taskId: string, commentId: string): Promise<void> {
        await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`)
    }

    async addReaction(taskId: string, commentId: string, payload: AddCommentReactionPayload): Promise<Comment> {
        return apiClient.post<Comment>(`/tasks/${taskId}/comments/${commentId}/reactions`, payload)
    }

    async removeReaction(taskId: string, commentId: string, payload: RemoveCommentReactionPayload): Promise<Comment> {
        return apiClient.delete<Comment>(`/tasks/${taskId}/comments/${commentId}/reactions/${payload.emoji}`)
    }

    // Legacy methods for backward compatibility
    async likeComment(taskId: string, commentId: string): Promise<Comment> {
        return this.addReaction(taskId, commentId, { commentId, emoji: '❤️' })
    }

    async unlikeComment(taskId: string, commentId: string): Promise<Comment> {
        return this.removeReaction(taskId, commentId, { commentId, emoji: '❤️' })
    }
}

export const commentApi = new CommentApi()

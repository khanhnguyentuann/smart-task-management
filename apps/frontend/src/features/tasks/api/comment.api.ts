/*
    API layer: Comments for tasks
*/
import { apiClient } from '@/core/services/api-client'
import type { Comment, CreateCommentPayload, UpdateCommentPayload } from '../types'

class CommentApi {
    async getTaskComments(taskId: string): Promise<Comment[]> {
        return apiClient.get<Comment[]>(`/tasks/${taskId}/comments`)
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

    async likeComment(taskId: string, commentId: string): Promise<Comment> {
        return apiClient.post<Comment>(`/tasks/${taskId}/comments/${commentId}/like`)
    }

    async unlikeComment(taskId: string, commentId: string): Promise<Comment> {
        return apiClient.delete<Comment>(`/tasks/${taskId}/comments/${commentId}/like`)
    }
}

export const commentApi = new CommentApi()

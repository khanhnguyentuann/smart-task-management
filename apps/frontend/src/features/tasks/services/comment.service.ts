/*
    Service layer: Contains business logic for comments
*/
import { commentApi } from '../api'
import type { Comment, CreateCommentPayload, UpdateCommentPayload } from '../types'

class CommentService {
    async getTaskComments(taskId: string): Promise<Comment[]> {
        const comments = await commentApi.getTaskComments(taskId)
        return this.transformComments(comments)
    }

    async addComment(taskId: string, content: string, mentions?: string[]): Promise<Comment> {
        const payload: CreateCommentPayload = { content, mentions }
        const comment = await commentApi.addComment(taskId, payload)
        return this.transformComment(comment)
    }

    async updateComment(taskId: string, commentId: string, content: string): Promise<Comment> {
        const payload: UpdateCommentPayload = { content }
        const comment = await commentApi.updateComment(taskId, commentId, payload)
        return this.transformComment(comment)
    }

    async deleteComment(taskId: string, commentId: string): Promise<void> {
        await commentApi.deleteComment(taskId, commentId)
    }

    async likeComment(taskId: string, commentId: string): Promise<Comment> {
        const comment = await commentApi.likeComment(taskId, commentId)
        return this.transformComment(comment)
    }

    async unlikeComment(taskId: string, commentId: string): Promise<Comment> {
        const comment = await commentApi.unlikeComment(taskId, commentId)
        return this.transformComment(comment)
    }

    // Transform backend data to frontend format
    private transformComment(comment: any): Comment {
        return {
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined,
        }
    }

    private transformComments(comments: any[]): Comment[] {
        return comments.map(comment => this.transformComment(comment))
    }
}

export const commentService = new CommentService()

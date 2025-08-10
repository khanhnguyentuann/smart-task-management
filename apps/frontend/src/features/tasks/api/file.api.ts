/*
    API layer: File attachments for tasks
*/
import { apiClient } from '@/core/services/api-client'
import type { FileAttachment, UploadFileResponse } from '../types'

class FileApi {
    async getTaskFiles(taskId: string): Promise<FileAttachment[]> {
        return apiClient.get<FileAttachment[]>(`/tasks/${taskId}/files`)
    }

    async uploadFile(taskId: string, file: File): Promise<UploadFileResponse> {
        const formData = new FormData()
        formData.append('file', file)
        
        return apiClient.post<UploadFileResponse>(
            `/tasks/${taskId}/files`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
    }

    async deleteFile(taskId: string, fileId: string): Promise<void> {
        await apiClient.delete(`/tasks/${taskId}/files/${fileId}`)
    }

    async downloadFile(taskId: string, fileId: string): Promise<Blob> {
        return apiClient.get(`/tasks/${taskId}/files/${fileId}/download`, {
            responseType: 'blob'
        })
    }

    async getFileShareLink(taskId: string, fileId: string): Promise<{ shareUrl: string }> {
        return apiClient.post<{ shareUrl: string }>(`/tasks/${taskId}/files/${fileId}/share`)
    }
}

export const fileApi = new FileApi()

/*
    Service layer: Contains business logic for file attachments
*/
import { fileApi } from '../api'
import type { FileAttachment, UploadFileResponse } from '../types'

class FileService {
    async getTaskFiles(taskId: string): Promise<FileAttachment[]> {
        const files = await fileApi.getTaskFiles(taskId)
        return this.transformFiles(files)
    }

    async uploadFile(taskId: string, file: File): Promise<UploadFileResponse> {
        // Validate file before upload
        this.validateFile(file)
        
        const response = await fileApi.uploadFile(taskId, file)
        return response
    }

    async deleteFile(taskId: string, fileId: string): Promise<void> {
        await fileApi.deleteFile(taskId, fileId)
    }

    async downloadFile(taskId: string, fileId: string, fileName: string): Promise<void> {
        const blob = await fileApi.downloadFile(taskId, fileId)
        this.downloadBlob(blob, fileName)
    }

    async getFileShareLink(taskId: string, fileId: string): Promise<string> {
        const response = await fileApi.getFileShareLink(taskId, fileId)
        return response.shareUrl
    }

    // File validation
    private validateFile(file: File): void {
        const maxSize = 50 * 1024 * 1024 // 50MB
        const allowedTypes = [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'image/svg+xml',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'application/zip'
        ]

        if (file.size > maxSize) {
            throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error('File type not supported')
        }
    }

    // Download blob as file
    private downloadBlob(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    // Format file size
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B'
        
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    // Get file icon based on type
    getFileIcon(fileName: string, type?: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase()
        
        if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
            return '🖼️'
        }
        if (type?.includes('pdf') || extension === 'pdf') {
            return '📄'
        }
        if (['doc', 'docx'].includes(extension || '')) {
            return '📝'
        }
        if (['xls', 'xlsx'].includes(extension || '')) {
            return '📊'
        }
        if (['zip', 'rar'].includes(extension || '')) {
            return '📦'
        }
        return '📎'
    }

    // Transform backend data to frontend format  
    private transformFiles(files: any[]): FileAttachment[] {
        return files.map(file => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt)
        }))
    }
}

export const fileService = new FileService()

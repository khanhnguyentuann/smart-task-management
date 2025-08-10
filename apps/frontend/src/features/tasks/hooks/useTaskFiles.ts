import { useCallback, useState, useEffect } from 'react'
import { fileService } from '../services'
import type { FileAttachment } from '../types'

export function useTaskFiles(taskId: string) {
    const [files, setFiles] = useState<FileAttachment[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchFiles = useCallback(async () => {
        if (!taskId) return
        
        setLoading(true)
        setError(null)
        try {
            const data = await fileService.getTaskFiles(taskId)
            setFiles(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load files')
        } finally {
            setLoading(false)
        }
    }, [taskId])

    const uploadFile = useCallback(async (file: File) => {
        if (!taskId) return
        
        setUploading(true)
        setError(null)
        try {
            const response = await fileService.uploadFile(taskId, file)
            
            // Add the new file to the list
            const newFile: FileAttachment = {
                id: response.fileId,
                name: file.name,
                size: fileService.formatFileSize(file.size),
                type: file.type,
                url: response.url,
                uploadedBy: 'You', // Will be replaced by backend
                uploadedAt: new Date()
            }
            
            setFiles(prev => [newFile, ...prev])
            return response
        } catch (err: any) {
            setError(err.message || 'Failed to upload file')
            throw err
        } finally {
            setUploading(false)
        }
    }, [taskId])

    const uploadMultipleFiles = useCallback(async (files: FileList) => {
        if (!taskId) return
        
        const fileArray = Array.from(files)
        const uploadPromises = fileArray.map(file => uploadFile(file))
        
        try {
            const results = await Promise.allSettled(uploadPromises)
            const failures = results.filter(result => result.status === 'rejected')
            
            if (failures.length > 0) {
                setError(`${failures.length} files failed to upload`)
            }
            
            return results
        } catch (err: any) {
            setError(err.message || 'Failed to upload files')
            throw err
        }
    }, [taskId, uploadFile])

    const deleteFile = useCallback(async (fileId: string) => {
        if (!taskId) return
        
        try {
            await fileService.deleteFile(taskId, fileId)
            setFiles(prev => prev.filter(file => file.id !== fileId))
        } catch (err: any) {
            setError(err.message || 'Failed to delete file')
            throw err
        }
    }, [taskId])

    const downloadFile = useCallback(async (fileId: string, fileName: string) => {
        if (!taskId) return
        
        try {
            await fileService.downloadFile(taskId, fileId, fileName)
        } catch (err: any) {
            setError(err.message || 'Failed to download file')
            throw err
        }
    }, [taskId])

    const getShareLink = useCallback(async (fileId: string) => {
        if (!taskId) return
        
        try {
            const shareUrl = await fileService.getFileShareLink(taskId, fileId)
            return shareUrl
        } catch (err: any) {
            setError(err.message || 'Failed to get share link')
            throw err
        }
    }, [taskId])

    // Auto-fetch on mount or taskId change
    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    return {
        files,
        loading,
        uploading,
        error,
        fetchFiles,
        uploadFile,
        uploadMultipleFiles,
        deleteFile,
        downloadFile,
        getShareLink,
        refresh: fetchFiles
    }
}

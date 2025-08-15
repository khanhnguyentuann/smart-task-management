"use client"

import { FileUploader } from "./FileUploader"
import { FileList } from "./FileList"
import { TaskDetail } from "../../../../types/task.types"
import { useCallback, useState } from "react"
import { useErrorHandler } from "@/shared/hooks"

interface FilesTabProps {
    currentTask: TaskDetail | null
    fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function FilesTab({ currentTask, fileInputRef }: FilesTabProps) {
    const [isUploading, setIsUploading] = useState(false)
    const { handleError } = useErrorHandler({
        context: { component: 'FilesTab' }
    })

    const handleFileSelect = useCallback(async (files: FileList) => {
        setIsUploading(true)
        try {
            // TODO: Implement file upload logic

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // TODO: Update task attachments after successful upload
        } catch (error: any) {
            handleError(error)
        } finally {
            setIsUploading(false)
        }
    }, [handleError])

    const handleViewFile = useCallback((attachmentId: string) => {
        // TODO: Implement file preview
    }, [])

    const handleDownloadFile = useCallback((attachmentId: string) => {
        // TODO: Implement file download
    }, [])

    const handleDeleteFile = useCallback((attachmentId: string) => {
        // TODO: Implement file deletion
    }, [])

    const handleShareFile = useCallback((attachmentId: string) => {
        // TODO: Implement file sharing
    }, [])

    return (
        <div className="space-y-4 mt-6">
            <FileUploader
                fileInputRef={fileInputRef}
                onFileSelect={handleFileSelect}
                maxSize={50} // 50MB limit
            />

            <FileList
                attachments={currentTask?.attachments}
                onViewFile={handleViewFile}
                onDownloadFile={handleDownloadFile}
                onDeleteFile={handleDeleteFile}
                onShareFile={handleShareFile}
                isLoading={isUploading}
            />
        </div>
    )
}

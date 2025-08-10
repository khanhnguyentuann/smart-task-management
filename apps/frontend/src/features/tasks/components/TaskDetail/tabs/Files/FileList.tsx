"use client"

import { FileItem } from "./FileItem"
import { TaskDetail } from "../../../../types/task.types"

interface FileListProps {
    attachments?: TaskDetail['attachments']
    onViewFile?: (attachmentId: string) => void
    onDownloadFile?: (attachmentId: string) => void
    onDeleteFile?: (attachmentId: string) => void
    onShareFile?: (attachmentId: string) => void
    isLoading?: boolean
}

export function FileList({
    attachments = [],
    onViewFile,
    onDownloadFile,
    onDeleteFile,
    onShareFile,
    isLoading = false
}: FileListProps) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {/* Loading skeleton */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
                        <div className="w-10 h-10 bg-muted rounded"></div>
                        <div className="flex-1 space-y-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-8 h-8 bg-muted rounded"></div>
                            <div className="w-8 h-8 bg-muted rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!attachments || attachments.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">
                    No files attached yet. Upload files to share them with your team.
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {attachments.map((attachment) => (
                <FileItem
                    key={attachment.id}
                    attachment={attachment}
                    onView={onViewFile}
                    onDownload={onDownloadFile}
                    onDelete={onDeleteFile}
                    onShare={onShareFile}
                />
            ))}
        </div>
    )
}

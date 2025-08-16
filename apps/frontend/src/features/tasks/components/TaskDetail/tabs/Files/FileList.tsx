"use client"

import { FileItem } from "./FileItem"
import { TaskDetail } from "../../../../types/task.types"
import { Upload, FileText, Image, Video, Music, Archive, File } from 'lucide-react'

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
            <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                            No files attached yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Upload files to share documents, images, or any resources with your team.
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 max-w-md">
                        <h4 className="text-sm font-medium text-foreground mb-3">📁 Supported Files:</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                <span>Documents (PDF, DOC, TXT)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image className="h-3 w-3" />
                                <span>Images (JPG, PNG, GIF)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Video className="h-3 w-3" />
                                <span>Videos (MP4, MOV)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Archive className="h-3 w-3" />
                                <span>Archives (ZIP, RAR)</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-border/50">
                            <h5 className="text-xs font-medium text-foreground mb-2">💡 Quick Tips:</h5>
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <div>• Drag & drop files directly into this area</div>
                                <div>• Maximum file size: 50MB per file</div>
                                <div>• Files are automatically organized by type</div>
                            </div>
                        </div>
                    </div>
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

"use client"

import { Button, buttonVariants } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Download, Eye, Paperclip, MoreHorizontal, Trash, Share, Copy } from 'lucide-react'
import { format } from "date-fns"
import { motion } from "framer-motion"

interface FileItemProps {
    attachment: {
        id: string
        name: string
        size: string
        type?: string
        url?: string
        uploadedBy: string
        uploadedAt: Date
    }
    onView?: (attachmentId: string) => void
    onDownload?: (attachmentId: string) => void
    onDelete?: (attachmentId: string) => void
    onShare?: (attachmentId: string) => void
    showActions?: boolean
}

export function FileItem({
    attachment,
    onView,
    onDownload,
    onDelete,
    onShare,
    showActions = true
}: FileItemProps) {
    const getFileIcon = (fileName: string, type?: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()
        const fileType = type?.toLowerCase()

        // You could expand this with more specific icons
        if (fileType?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
            return '🖼️'
        }
        if (fileType?.includes('pdf') || extension === 'pdf') {
            return '📄'
        }
        if (fileType?.includes('video') || ['mp4', 'avi', 'mov', 'mkv'].includes(extension || '')) {
            return '🎥'
        }
        if (fileType?.includes('audio') || ['mp3', 'wav', 'ogg'].includes(extension || '')) {
            return '🎵'
        }
        if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
            return '📝'
        }
        if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
            return '📊'
        }
        if (['zip', 'rar', '7z', 'tar'].includes(extension || '')) {
            return '📦'
        }
        return '📎'
    }

    const formatFileSize = (size: string) => {
        // If size is already formatted (e.g., "2.4 MB"), return as is
        if (size.includes('B')) return size

        // Otherwise, assume it's in bytes and format
        const bytes = parseInt(size)
        if (isNaN(bytes)) return size

        const mb = bytes / (1024 * 1024)
        if (mb >= 1) return `${mb.toFixed(1)} MB`
        const kb = bytes / 1024
        if (kb >= 1) return `${kb.toFixed(1)} KB`
        return `${bytes} B`
    }

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
        >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                <span className="text-lg">{getFileIcon(attachment.name, attachment.type)}</span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{attachment.name}</p>
                <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy} • {format(attachment.uploadedAt, "MMM d, yyyy")}
                </p>
            </div>

            {showActions && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onView && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(attachment.id)}
                            title="Preview file"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}

                    {onDownload && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(attachment.id)}
                            title="Download file"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onShare && (
                                <DropdownMenuItem onClick={() => onShare(attachment.id)}>
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(attachment.url || attachment.name)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy link
                            </DropdownMenuItem>
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(attachment.id)}
                                    className="text-red-600"
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </motion.div>
    )
}

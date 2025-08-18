"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"

import { MoreHorizontal, Reply, Quote, Trash2, Download, FileText, ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog"
import { Comment, CommentAttachment, CommentReaction } from "../../../../types/task.types"
import { REACTION_EMOJIS } from "../../../../constants/reactions"
import { CommentEditor } from "./CommentEditor"
import { MarkdownRenderer } from "./MarkdownRenderer"

interface CommentItemProps {
    comment: Comment
    currentUserId?: string
    onEdit?: (commentId: string, content: string) => Promise<Comment | undefined>
    onDelete?: (commentId: string) => Promise<void>
    onReply?: (commentId: string) => void
    onQuote?: (commentId: string) => void
    onReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onRemoveReaction?: (commentId: string, emoji: string) => Promise<Comment | undefined>
    onDownloadAttachment?: (attachment: CommentAttachment) => void
    isReply?: boolean
}

export function CommentItem({
    comment,
    currentUserId,
    onEdit,
    onDelete,
    onReply,
    onQuote,
    onReaction,
    onRemoveReaction,
    onDownloadAttachment,
    isReply = false
}: CommentItemProps) {
    const [showReplyEditor, setShowReplyEditor] = useState(false)
    const [showQuoteEditor, setShowQuoteEditor] = useState(false)

    const [replyContent, setReplyContent] = useState("")
    const [quoteContent, setQuoteContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const isAuthor = comment.user.id === currentUserId
    const timeAgo = format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")
    const hasReplies = comment.replies && comment.replies.length > 0

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const isImage = (type: string) => type.startsWith("image/")

    const handleReply = (content: string, files?: File[]) => {
        // TODO: Implement reply functionality
        setShowReplyEditor(false)
    }

    const handleQuote = (content: string, files?: File[]) => {
        // TODO: Implement quote functionality
        setShowQuoteEditor(false)
    }



    const handleDelete = async () => {
        if (!onDelete) return

        setIsDeleting(true)
        try {
            await onDelete(comment.id)
        } catch (error) {
            console.error('Failed to delete comment:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleReaction = async (emoji: string) => {
        if (!onReaction) return

        try {
            await onReaction(comment.id, emoji)
        } catch (error) {
            console.error('Failed to add reaction:', error)
        }
    }

    const getReactionCount = (emoji: string) => {
        return comment.reactions?.filter(r => r.emoji === emoji).length || 0
    }

    const hasUserReacted = (emoji: string) => {
        return comment.reactions?.some(r => r.emoji === emoji && r.userId === currentUserId) || false
    }

    return (
        <div className={`space-y-4 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
            <Card className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={comment.user?.avatar && comment.user.avatar.startsWith('data:image')
                                ? comment.user.avatar
                                : (comment.user?.avatar || '/default-avatar.svg')}
                            alt={`${comment.user.firstName} ${comment.user.lastName}`}
                        />
                        <AvatarFallback>
                            {`${comment.user.firstName?.[0] || ''}${comment.user.lastName?.[0] || ''}` || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                                {`${comment.user.firstName} ${comment.user.lastName}`}
                            </span>
                            <span className="text-sm text-muted-foreground">{timeAgo}</span>
                            {comment.isEdited && (
                                <Badge variant="secondary" className="text-xs">
                                    edited
                                </Badge>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <MarkdownRenderer content={comment.formattedContent || comment.content} />
                        </div>

                        {comment.attachments && comment.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {comment.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                                        {isImage(attachment.mimeType) ? (
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4" />
                                                <Image
                                                    src={attachment.fileUrl || "/placeholder.svg"}
                                                    alt={attachment.fileName}
                                                    width={128}
                                                    height={128}
                                                    className="max-w-xs max-h-32 rounded object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <FileText className="h-4 w-4" />
                                                <span className="text-sm">{attachment.fileName}</span>
                                                <span className="text-xs text-muted-foreground">({formatFileSize(attachment.fileSize)})</span>
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-auto"
                                            onClick={() => onDownloadAttachment?.(attachment)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                            {/* Reactions */}
                            <div className="flex items-center gap-1">
                                {comment.reactions && comment.reactions.length > 0 && (
                                    <>
                                        {REACTION_EMOJIS.map((emoji) => {
                                            const count = getReactionCount(emoji)
                                            if (count === 0) return null

                                            return (
                                                <Button
                                                    key={emoji}
                                                    variant={hasUserReacted(emoji) ? "default" : "ghost"}
                                                    size="sm"
                                                    className="h-7 px-2 gap-1"
                                                    onClick={() => handleReaction(emoji)}
                                                >
                                                    <span>{emoji}</span>
                                                    <span className="text-xs">{count}</span>
                                                </Button>
                                            )
                                        })}
                                    </>
                                )}

                                {/* Add reaction dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                            <span>😊</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="grid grid-cols-4 gap-1 p-2">
                                            {REACTION_EMOJIS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleReaction(emoji)}
                                                    className="p-2 hover:bg-accent rounded text-lg"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-1 ml-auto">
                                {onReply && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowReplyEditor(!showReplyEditor)}
                                        className="h-7 px-2 gap-1"
                                    >
                                        <Reply className="h-3 w-3" />
                                        Reply
                                    </Button>
                                )}

                                {onQuote && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowQuoteEditor(!showQuoteEditor)}
                                        className="h-7 px-2 gap-1"
                                    >
                                        <Quote className="h-3 w-3" />
                                        Quote
                                    </Button>
                                )}

                                {(isAuthor || onEdit || onDelete) && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {isAuthor && onDelete && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this comment? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={handleDelete}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? 'Deleting...' : 'Delete'}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {showReplyEditor && (
                <div className="ml-11">
                    <CommentEditor
                        user={{
                            ...comment.user,
                            email: `${comment.user.firstName.toLowerCase()}.${comment.user.lastName.toLowerCase()}@example.com`
                        }}
                        newComment={replyContent}
                        setNewComment={setReplyContent}
                        onAddComment={() => handleReply(replyContent, [])}
                        placeholder="Write a reply..."
                        compact
                    />
                </div>
            )}

            {showQuoteEditor && (
                <div className="ml-11">
                    <CommentEditor
                        user={{
                            ...comment.user,
                            email: `${comment.user.firstName.toLowerCase()}.${comment.user.lastName.toLowerCase()}@example.com`
                        }}
                        newComment={quoteContent}
                        setNewComment={setQuoteContent}
                        onAddComment={() => handleQuote(quoteContent, [])}
                        quotedComment={comment}
                        placeholder="Quote and reply..."
                        compact
                    />
                </div>
            )}

            {/* Render replies */}
            {hasReplies && (
                <div className="space-y-4">
                    {comment.replies?.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onReply={onReply}
                            onQuote={onQuote}
                            onReaction={onReaction}
                            onRemoveReaction={onRemoveReaction}
                            onDownloadAttachment={onDownloadAttachment}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

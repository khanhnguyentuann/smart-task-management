"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"

import { MoreHorizontal, Reply, Quote, Trash2, Download, FileText, ImageIcon, Edit3 } from "lucide-react"
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
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [reactionDropdownOpen, setReactionDropdownOpen] = useState(false)

    const [replyContent, setReplyContent] = useState("")
    const [quoteContent, setQuoteContent] = useState("")
    const [editContent, setEditContent] = useState(comment.content)
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

    const handleEdit = async () => {
        if (!onEdit) return

        setIsSubmitting(true)
        try {
            await onEdit(comment.id, editContent)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to edit comment:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditContent(comment.content)
    }



    const handleDelete = async () => {
        if (!onDelete) return

        setIsDeleting(true)
        try {
            await onDelete(comment.id)
            setShowDeleteDialog(false) // Close dialog after successful deletion
        } catch (error) {
            console.error('Failed to delete comment:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleReaction = async (emoji: string) => {
        if (!onReaction) return

        try {
            // Check if user already reacted to this emoji
            const hasReacted = hasUserReacted(emoji)
            
            if (hasReacted && onRemoveReaction) {
                // Remove reaction if user already reacted to this emoji
                await onRemoveReaction(comment.id, emoji)
            } else {
                // Add/Replace reaction - backend will handle replacing existing reaction
                await onReaction(comment.id, emoji)
            }
            
            // Close the reaction dropdown after handling the reaction
            setReactionDropdownOpen(false)
        } catch (error) {
            console.error('Failed to handle reaction:', error)
        }
    }

    const getReactionCount = (emoji: string) => {
        return comment.reactions?.filter(r => r.emoji === emoji).length || 0
    }

    const hasUserReacted = (emoji: string) => {
        return comment.reactions?.some(r => r.emoji === emoji && r.userId === currentUserId) || false
    }

    const getUserCurrentReaction = () => {
        return comment.reactions?.find(r => r.userId === currentUserId)?.emoji || null
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

                        {isEditing ? (
                            <div className="space-y-3">
                                <CommentEditor
                                    user={{
                                        ...comment.user,
                                        email: `${comment.user.firstName.toLowerCase()}.${comment.user.lastName.toLowerCase()}@example.com`
                                    }}
                                    newComment={editContent}
                                    setNewComment={setEditContent}
                                    onAddComment={handleEdit}
                                    isSubmitting={isSubmitting}
                                    placeholder="Edit your comment..."
                                    compact
                                    showCancelButton={true}
                                    onCancel={handleCancelEdit}
                                    submitButtonText={isSubmitting ? 'Saving...' : 'Save'}
                                />
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none">
                                <MarkdownRenderer content={comment.formattedContent || comment.content} />
                            </div>
                        )}

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
                                {/* Show reactions that have been used */}
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
                                                    className="h-7 px-2 gap-1 hover:bg-accent"
                                                    onClick={() => handleReaction(emoji)}
                                                >
                                                    <span>{emoji}</span>
                                                    <span className="text-xs">{count}</span>
                                                </Button>
                                            )
                                        })}
                                    </>
                                )}

                                {/* Add reaction dropdown - always show */}
                                <DropdownMenu open={reactionDropdownOpen} onOpenChange={setReactionDropdownOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-7 px-2 hover:bg-accent"
                                            title="Add reaction"
                                        >
                                            <span>😊</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="grid grid-cols-5 gap-1 p-2">
                                            {REACTION_EMOJIS.map((emoji) => {
                                                const count = getReactionCount(emoji)
                                                const hasReacted = hasUserReacted(emoji)
                                                
                                                return (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => handleReaction(emoji)}
                                                        className={`p-2 hover:bg-accent rounded text-lg relative ${
                                                            hasReacted ? 'bg-accent/50' : ''
                                                        }`}
                                                        title={`${emoji} ${count > 0 ? `(${count})` : ''}`}
                                                    >
                                                        <span>{emoji}</span>
                                                        {count > 0 && (
                                                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                                {count}
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            })}
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
                                            {isAuthor && onEdit && (
                                                <DropdownMenuItem
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    <Edit3 className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                            )}
                                            {isAuthor && onDelete && (
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    disabled={isDeleting}
                                                    onClick={() => setShowDeleteDialog(true)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                                </DropdownMenuItem>
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
        </div>
    )
}

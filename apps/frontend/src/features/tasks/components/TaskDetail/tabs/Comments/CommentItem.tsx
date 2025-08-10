"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button/Button"
import { MoreHorizontal, Heart, Reply, Edit, Trash } from 'lucide-react'
import { format } from "date-fns"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"

interface CommentItemProps {
    comment: {
        id: string
        content: string
        author: {
            id: string
            name: string
            avatar: string
        }
        createdAt: Date
        mentions?: string[]
    }
    currentUserId?: string
    onEdit?: (commentId: string) => void
    onDelete?: (commentId: string) => void
    onReply?: (commentId: string) => void
}

export function CommentItem({
    comment,
    currentUserId,
    onEdit,
    onDelete,
    onReply
}: CommentItemProps) {
    const isAuthor = comment.author.id === currentUserId
    const timeAgo = format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 group"
        >
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={comment.author?.avatar && comment.author.avatar.startsWith('data:image')
                        ? comment.author.avatar
                        : (comment.author?.avatar || '/default-avatar.svg')}
                    alt={comment.author?.name || 'User'}
                />
                <AvatarFallback>
                    {(comment.author?.name || "U").split(" ").map((n: string) => n?.[0] || "").join("") || "U"}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.author?.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo}</span>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        Like
                    </Button>

                    {onReply && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => onReply(comment.id)}
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                        </Button>
                    )}

                    {(isAuthor || onEdit || onDelete) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isAuthor && onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(comment.id)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {isAuthor && onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(comment.id)}
                                        className="text-red-600"
                                    >
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

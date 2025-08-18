"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Reply, Quote, Edit, Trash2, Download, FileText, ImageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CommentEditor } from "./comment-editor"
import { MarkdownRenderer } from "./markdown-renderer"
import type { Comment } from "@/types/comment"
import { formatDistanceToNow } from "date-fns"

interface CommentThreadProps {
  comment: Comment
  onReply: (parentId: string, content: string, files?: File[]) => void
  onReaction: (commentId: string, emoji: string) => void
  level?: number
}

const REACTION_EMOJIS = ["👍", "👎", "✅", "👀", "❤️", "😮", "🔥"]

export function CommentThread({ comment, onReply, onReaction, level = 0 }: CommentThreadProps) {
  const [showReplyEditor, setShowReplyEditor] = useState(false)
  const [showQuoteEditor, setShowQuoteEditor] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleReply = (content: string, files?: File[]) => {
    onReply(comment.id, content, files)
    setShowReplyEditor(false)
  }

  const handleQuote = (content: string, files?: File[]) => {
    onReply(comment.id, content, files)
    setShowQuoteEditor(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = (type: string) => type.startsWith("image/")

  return (
    <div className={`space-y-4 ${level > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
              {comment.updatedAt > comment.createdAt && (
                <Badge variant="secondary" className="text-xs">
                  edited
                </Badge>
              )}
            </div>

            {isEditing ? (
              <CommentEditor
                initialContent={comment.content}
                onSubmit={(content) => {
                  // Handle edit
                  setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
                compact
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={comment.content} />
              </div>
            )}

            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {comment.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                    {isImage(attachment.type) ? (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <img
                          src={attachment.url || "/placeholder.svg"}
                          alt={attachment.name}
                          className="max-w-xs max-h-32 rounded object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(attachment.size)})</span>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              {/* Reactions */}
              <div className="flex items-center gap-1">
                {comment.reactions?.map((reaction) => (
                  <Button
                    key={reaction.emoji}
                    variant={reaction.userReacted ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-2 gap-1"
                    onClick={() => onReaction(comment.id, reaction.emoji)}
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-xs">{reaction.count}</span>
                  </Button>
                ))}

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
                          onClick={() => onReaction(comment.id, emoji)}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyEditor(!showReplyEditor)}
                  className="h-7 px-2 gap-1"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuoteEditor(!showQuoteEditor)}
                  className="h-7 px-2 gap-1"
                >
                  <Quote className="h-3 w-3" />
                  Quote
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showReplyEditor && (
        <div className="ml-11">
          <CommentEditor
            onSubmit={handleReply}
            onCancel={() => setShowReplyEditor(false)}
            placeholder="Write a reply..."
            compact
          />
        </div>
      )}

      {showQuoteEditor && (
        <div className="ml-11">
          <CommentEditor
            onSubmit={handleQuote}
            onCancel={() => setShowQuoteEditor(false)}
            quotedContent={comment.content}
            placeholder="Quote and reply..."
            compact
          />
        </div>
      )}

      {/* Render replies */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentThread key={reply.id} comment={reply} onReply={onReply} onReaction={onReaction} level={level + 1} />
        ))}
    </div>
  )
}

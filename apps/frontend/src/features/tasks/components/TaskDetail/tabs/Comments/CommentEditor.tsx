"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Send, Loader2, AlertCircle, Paperclip, X, FileText, ImageIcon, Bold, Italic, List, Code, AtSign } from 'lucide-react'
import type { User } from "@/shared/lib/types"
import { cn } from "@/shared/lib/utils"

interface CommentEditorProps {
    user: User
    newComment: string
    setNewComment: (value: string) => void
    onAddComment: () => void
    isSubmitting?: boolean
    error?: string
    selectedFiles?: File[]
    onFilesChange?: (files: File[]) => void
    // Reply/Quote props
    replyingTo?: string | null
    quotedComment?: any | null
    onCancelReply?: () => void
    onCancelQuote?: () => void
    // New props for enhanced editor
    placeholder?: string
    compact?: boolean
}

// Mock team members for mentions
const TEAM_MEMBERS = [
    { id: "user1", name: "Alice Johnson", username: "alice", email: "alice@example.com" },
    { id: "user2", name: "Bob Smith", username: "bob", email: "bob@example.com" },
    { id: "user3", name: "Carol Davis", username: "carol", email: "carol@example.com" },
    { id: "user4", name: "David Wilson", username: "david", email: "david@example.com" },
]

export function CommentEditor({
    user,
    newComment,
    setNewComment,
    onAddComment,
    isSubmitting = false,
    error,
    selectedFiles = [],
    onFilesChange,
    replyingTo,
    quotedComment,
    onCancelReply,
    onCancelQuote,
    placeholder = "Write a comment...",
    compact = false
}: CommentEditorProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [showMentions, setShowMentions] = useState(false)
    const [mentionQuery, setMentionQuery] = useState("")
    const [cursorPosition, setCursorPosition] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            if (newComment.trim() && !isSubmitting) {
                onAddComment()
            }
        }

        if (e.key === "@") {
            setShowMentions(true)
            setMentionQuery("")
            setCursorPosition(textareaRef.current?.selectionStart || 0)
        }

        if (showMentions && (e.key === "Escape" || e.key === " ")) {
            setShowMentions(false)
        }
    }, [newComment, isSubmitting, onAddComment, showMentions])

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setNewComment(value)

        if (showMentions) {
            const cursorPos = e.target.selectionStart
            const textBeforeCursor = value.substring(0, cursorPos)
            const lastAtIndex = textBeforeCursor.lastIndexOf("@")

            if (lastAtIndex !== -1) {
                const query = textBeforeCursor.substring(lastAtIndex + 1)
                if (query.includes(" ") || query.includes("\n")) {
                    setShowMentions(false)
                } else {
                    setMentionQuery(query)
                }
            } else {
                setShowMentions(false)
            }
        }
    }, [setNewComment, showMentions])

    const insertMention = useCallback((member: (typeof TEAM_MEMBERS)[0]) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const beforeCursor = newComment.substring(0, cursorPosition)
        const afterCursor = newComment.substring(textarea.selectionStart)
        const lastAtIndex = beforeCursor.lastIndexOf("@")

        const newContent = beforeCursor.substring(0, lastAtIndex) + `@${member.username} ` + afterCursor

        setNewComment(newContent)
        setShowMentions(false)

        // Focus back to textarea
        setTimeout(() => {
            textarea.focus()
            const newPosition = lastAtIndex + member.username.length + 2
            textarea.setSelectionRange(newPosition, newPosition)
        }, 0)
    }, [newComment, cursorPosition, setNewComment])

    const insertFormatting = useCallback((format: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = newComment.substring(start, end)

        let newText = ""
        let cursorOffset = 0

        switch (format) {
            case "bold":
                newText = `**${selectedText}**`
                cursorOffset = selectedText ? 0 : 2
                break
            case "italic":
                newText = `*${selectedText}*`
                cursorOffset = selectedText ? 0 : 1
                break
            case "code":
                newText = `\`${selectedText}\``
                cursorOffset = selectedText ? 0 : 1
                break
            case "list":
                newText = `\n- ${selectedText}`
                cursorOffset = selectedText ? 0 : 0
                break
        }

        const newContent = newComment.substring(0, start) + newText + newComment.substring(end)
        setNewComment(newContent)

        setTimeout(() => {
            textarea.focus()
            const newPosition = start + newText.length - cursorOffset
            textarea.setSelectionRange(newPosition, newPosition)
        }, 0)
    }, [newComment, setNewComment])

    const handleSubmit = useCallback(() => {
        if (newComment.trim() && !isSubmitting) {
            onAddComment()
        }
    }, [newComment, isSubmitting, onAddComment])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0 && onFilesChange) {
            // Validate file sizes (5MB limit for comment attachments)
            const maxSize = 5 * 1024 * 1024 // 5MB
            const validFiles = files.filter(file => file.size <= maxSize)
            const oversizedFiles = files.filter(file => file.size > maxSize)

            if (oversizedFiles.length > 0) {
                alert(`Some files exceed the 5MB limit and will be ignored.`)
            }

            onFilesChange([...selectedFiles, ...validFiles])
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [selectedFiles, onFilesChange])

    const handleRemoveFile = useCallback((index: number) => {
        if (onFilesChange) {
            onFilesChange(selectedFiles.filter((_, i) => i !== index))
        }
    }, [selectedFiles, onFilesChange])

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const isDisabled = !newComment.trim() && selectedFiles.length === 0 || isSubmitting
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const shortcutText = isMac ? '⌘+Enter' : 'Ctrl+Enter'

    const filteredMembers = TEAM_MEMBERS.filter(
        (member) =>
            member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            member.username.toLowerCase().includes(mentionQuery.toLowerCase()),
    )

    return (
        <Card className={cn("p-4", compact && "p-3")}>
            {quotedComment && (
                <div className="mb-3 p-3 bg-muted rounded border-l-4 border-primary">
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{quotedComment.content}</div>
                </div>
            )}

            <div className="space-y-3">
                <div className="relative">
                    <Textarea
                        ref={textareaRef}
                        value={newComment}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className={cn("min-h-[100px] resize-none", compact && "min-h-[80px]")}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isSubmitting}
                    />
                    {error && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>{error}</span>
                        </div>
                    )}

                    {showMentions && filteredMembers.length > 0 && (
                        <Card className="absolute z-10 mt-1 w-64 max-h-48 overflow-y-auto">
                            {filteredMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => insertMention(member)}
                                    className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2"
                                >
                                    <AtSign className="h-4 w-4" />
                                    <div>
                                        <div className="font-medium">{member.name}</div>
                                        <div className="text-sm text-muted-foreground">@{member.username}</div>
                                    </div>
                                </button>
                            ))}
                        </Card>
                    )}
                </div>

                {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                                {file.type.startsWith('image/') ? (
                                    <ImageIcon className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <FileText className="h-4 w-4" aria-hidden="true" />
                                )}
                                <span className="text-xs truncate max-w-20">
                                    {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({formatFileSize(file.size)})
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleRemoveFile(index)}
                                    disabled={isSubmitting}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => insertFormatting("bold")} className="h-8 w-8 p-0">
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => insertFormatting("italic")} className="h-8 w-8 p-0">
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => insertFormatting("code")} className="h-8 w-8 p-0">
                            <Code className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => insertFormatting("list")} className="h-8 w-8 p-0">
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                            className="h-8 px-2"
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {(replyingTo || quotedComment) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={replyingTo ? onCancelReply : onCancelQuote}
                                className="h-6 w-6 p-0"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        <EnhancedButton
                            onClick={handleSubmit}
                            disabled={isDisabled}
                            className="px-4"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    {compact ? "Reply" : "Send Comment"}
                                </>
                            )}
                        </EnhancedButton>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground">
                    Press {shortcutText} to submit • Use @ to mention team members
                </div>
            </div>
        </Card>
    )
}

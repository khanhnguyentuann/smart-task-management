"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { Send, Loader2, AlertCircle } from 'lucide-react'
import type { User } from "@/shared/lib/types"
import { useState, useCallback } from 'react'

interface CommentEditorProps {
    user: User
    newComment: string
    setNewComment: (value: string) => void
    onAddComment: () => void
    isSubmitting?: boolean
    error?: string
}

export function CommentEditor({
    user,
    newComment,
    setNewComment,
    onAddComment,
    isSubmitting = false,
    error
}: CommentEditorProps) {
    const [isFocused, setIsFocused] = useState(false)
    
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            if (newComment.trim() && !isSubmitting) {
                onAddComment()
            }
        }
    }, [newComment, isSubmitting, onAddComment])

    const handleSubmit = useCallback(() => {
        if (newComment.trim() && !isSubmitting) {
            onAddComment()
        }
    }, [newComment, isSubmitting, onAddComment])

    const isDisabled = !newComment.trim() || isSubmitting
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const shortcutText = isMac ? '⌘+Enter' : 'Ctrl+Enter'

    return (
        <Card className={`transition-all duration-200 ${isFocused ? 'ring-2 ring-primary/20' : ''}`}>
            <CardHeader className="pb-3">
                <Label className="text-sm font-medium">Add Comment</Label>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                                src={user.avatar && user.avatar.startsWith('data:image')
                                    ? user.avatar
                                    : (user.avatar || '/default-avatar.svg')}
                                alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="text-xs">
                                {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="relative">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment... Use @ to mention someone, # for hashtags, or **bold** text"
                                    rows={3}
                                    className={`resize-none transition-all duration-200 ${
                                        error ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                    onKeyDown={handleKeyDown}
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
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium">{shortcutText}</span>
                                        <span>to send</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium">Shift+Enter</span>
                                        <span>for new line</span>
                                    </span>
                                </div>
                                
                                <EnhancedButton
                                    onClick={handleSubmit}
                                    size="sm"
                                    disabled={isDisabled}
                                    className={`transition-all duration-200 ${
                                        isDisabled 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Comment
                                        </>
                                    )}
                                </EnhancedButton>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

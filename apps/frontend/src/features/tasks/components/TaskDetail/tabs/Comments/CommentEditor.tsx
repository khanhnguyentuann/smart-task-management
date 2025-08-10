"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card/Card"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { Send } from 'lucide-react'

interface CommentEditorProps {
    user: any
    newComment: string
    setNewComment: (value: string) => void
    onAddComment: () => void
    isSubmitting?: boolean
}

export function CommentEditor({
    user,
    newComment,
    setNewComment,
    onAddComment,
    isSubmitting = false
}: CommentEditorProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            onAddComment()
        }
    }

    return (
        <Card>
            <CardHeader>
                <Label>Add Comment</Label>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={user.avatar && user.avatar.startsWith('data:image')
                                    ? user.avatar
                                    : (user.avatar || '/default-avatar.svg')}
                                alt={user.name}
                            />
                            <AvatarFallback>
                                {user.name?.split(" ").map((n: any) => n[0]).join("") || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment... Use @ to mention someone"
                                rows={3}
                                className="resize-none"
                                onKeyDown={handleKeyDown}
                                disabled={isSubmitting}
                            />
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">
                                    Press Ctrl+Enter to submit
                                </p>
                                <EnhancedButton
                                    onClick={onAddComment}
                                    size="sm"
                                    disabled={!newComment.trim() || isSubmitting}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {isSubmitting ? 'Posting...' : 'Comment'}
                                </EnhancedButton>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

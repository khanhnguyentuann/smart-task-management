"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Share2, Copy, Mail, MessageSquare } from 'lucide-react'

interface ShareTaskModalProps {
    taskId: string
    taskTitle?: string
    trigger?: React.ReactNode
}

export function ShareTaskModal({ taskId, taskTitle, trigger }: ShareTaskModalProps) {
    const [shareLink, setShareLink] = useState("")

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareLink(`${window.location.origin}/tasks/${taskId}`)
        }
    }, [taskId])

    const handleCopyLink = () => {
        if (shareLink) {
            navigator.clipboard.writeText(shareLink)
            // Could add toast notification here
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Task</DialogTitle>
                    <DialogDescription>
                        Share &quot;{taskTitle}&quot; with others
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="share-link">Task Link</Label>
                        <div className="flex gap-2">
                            <Input
                                id="share-link"
                                value={shareLink}
                                readOnly
                                className="flex-1"
                            />
                            <Button onClick={handleCopyLink} size="sm">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Slack
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

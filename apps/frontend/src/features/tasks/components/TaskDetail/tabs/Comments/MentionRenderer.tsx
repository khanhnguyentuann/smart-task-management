"use client"

import { Badge } from "@/shared/components/ui/badge"
import { AtSign } from 'lucide-react'

interface MentionRendererProps {
    content: string
    mentions: string[]
    users?: Array<{
        id: string
        firstName: string
        lastName: string
        avatar?: string
    }>
}

export function MentionRenderer({ content, mentions, users = [] }: MentionRendererProps) {
    if (!mentions || mentions.length === 0) {
        return <span>{content}</span>
    }

    // Create a map of user IDs to user objects for quick lookup
    const userMap = new Map(users.map(user => [user.id, user]))

    // Split content by mentions and render them
    const parts = content.split(/(@\w+)/g)

    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('@')) {
                    const userId = part.slice(1) // Remove @ symbol
                    const user = userMap.get(userId)
                    
                    if (user) {
                        return (
                            <Badge 
                                key={index} 
                                variant="secondary" 
                                className="inline-flex items-center gap-1 mx-1 px-1 py-0 text-xs"
                            >
                                <AtSign className="h-3 w-3" />
                                {user.firstName} {user.lastName}
                            </Badge>
                        )
                    }
                }
                return <span key={index}>{part}</span>
            })}
        </span>
    )
}

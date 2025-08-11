"use client"

import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { UserMinus } from "lucide-react"

interface MemberRowProps {
    member: any
    isOwner: boolean
    canRemove: boolean
    onRemove: (memberId: string, memberName: string) => void
}

export function MemberRow({ member, isOwner, canRemove, onRemove }: MemberRowProps) {
    const memberName = `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim()

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage
                        src={member.user?.avatar && member.user.avatar.startsWith('data:image')
                            ? member.user.avatar
                            : (member.user?.avatar || '/default-avatar.svg')}
                        alt={memberName}
                    />
                    <AvatarFallback>
                        {(member.user?.firstName || "").charAt(0)}
                        {(member.user?.lastName || "").charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{memberName}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant={isOwner ? "default" : "secondary"}>
                            {isOwner ? "Owner" : "Member"}
                        </Badge>
                        {member.user?.email && (
                            <span className="text-xs text-muted-foreground">{member.user.email}</span>
                        )}
                    </div>
                </div>
            </div>
            {canRemove && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(member.user?.id, memberName)}
                    className="text-red-600 hover:text-red-700"
                >
                    <UserMinus className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

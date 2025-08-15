"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { UserPlus } from "lucide-react"
import { MemberRow } from "./MemberRow"
import { useUser } from "@/features/layout"
import { getProjectPermissions } from "@/shared/lib/permissions"

interface ProjectMembersProps {
    project: any
    onAddMember: () => void
    onRemoveMember: (memberId: string, memberName: string) => void
}

export function ProjectMembers({ project, onAddMember, onRemoveMember }: ProjectMembersProps) {
    const { user } = useUser()
    const { canManageMembers } = getProjectPermissions(project, user)

    // Combine owner and members for display
    const allMembers = [
        // Add owner as first member
        {
            user: project.owner,
            joinedAt: project.createdAt, // Use project creation date for owner
            isOwner: true
        },
        // Add existing members
        ...(project.members || []).map((m: any) => ({
            ...m,
            isOwner: false
        }))
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Project Members</CardTitle>
                    {canManageMembers && (
                        <Button onClick={onAddMember} size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Member
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {allMembers.map((m: any, index: number) => (
                        <MemberRow
                            key={index}
                            member={m}
                            isOwner={m.isOwner}
                            canRemove={canManageMembers && m.user?.id !== user?.id && !m.isOwner}
                            onRemove={onRemoveMember}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

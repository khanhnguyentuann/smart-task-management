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
                    {project.members?.map((m: any, index: number) => (
                        <MemberRow
                            key={index}
                            member={m}
                            isOwner={m.user?.id === project.ownerId}
                            canRemove={canManageMembers && m.user?.id !== user?.id}
                            onRemove={onRemoveMember}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { X, Plus, User } from "lucide-react"

interface Assignee {
    id: string
    userId: string
    assignedAt: string
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatar?: string
    }
    assignedByUser: {
        id: string
        firstName: string
        lastName: string
    }
}

interface Member {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
}

interface AssigneeManagerProps {
    assignees: Assignee[]
    availableMembers: Member[]
    canEdit: boolean
    onAddAssignee: (userId: string) => void
    onRemoveAssignee: (userId: string) => void
}

export function AssigneeManager({
    assignees,
    availableMembers,
    canEdit,
    onAddAssignee,
    onRemoveAssignee
}: AssigneeManagerProps) {
    const [selectedMember, setSelectedMember] = useState<string>("")

    // Get members that are not already assigned (with null checks)
    const unassignedMembers = availableMembers.filter(
        member => member && !assignees.some(assignee => assignee?.userId === member.id)
    )

    const handleAddAssignee = () => {
        if (selectedMember) {
            onAddAssignee(selectedMember)
            setSelectedMember("")
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const formatAssignedDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Assignees</h3>
                {canEdit && unassignedMembers.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Select value={selectedMember} onValueChange={setSelectedMember}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select member..." />
                            </SelectTrigger>
                            <SelectContent>
                                {unassignedMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(member.firstName, member.lastName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{member.firstName} {member.lastName}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleAddAssignee}
                            disabled={!selectedMember}
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </Button>
                    </div>
                )}
            </div>

            {assignees.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No assignees yet</p>
                        {canEdit && (
                            <p className="text-sm">Add team members to this task</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {assignees.map((assignee) => (
                        <div
                            key={assignee.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={assignee.user.avatar} />
                                    <AvatarFallback>
                                        {getInitials(assignee.user.firstName, assignee.user.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {assignee.user.firstName} {assignee.user.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {assignee.user.email}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Assigned by {assignee.assignedByUser.firstName} {assignee.assignedByUser.lastName} on {formatAssignedDate(assignee.assignedAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">Assignee</Badge>
                                {canEdit && (
                                    <Button
                                        onClick={() => onRemoveAssignee(assignee.userId)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {assignees.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    {assignees.length} assignee{assignees.length !== 1 ? 's' : ''} total
                </div>
            )}
        </div>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { X, Plus, User, Crown, Calendar, UserCheck, GripVertical } from "lucide-react"
import { format } from "date-fns"

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
    onReorderAssignees?: (assignees: Assignee[]) => void
}

export function AssigneeManager({
    assignees,
    availableMembers,
    canEdit,
    onAddAssignee,
    onRemoveAssignee,
    onReorderAssignees
}: AssigneeManagerProps) {
    const [selectedMember, setSelectedMember] = useState<string>("")
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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
        return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    }

    // Get primary assignee (first assigned or most recently assigned)
    const primaryAssignee = assignees.length > 0 ? assignees[0] : null

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null)
            setDragOverIndex(null)
            return
        }

        const newAssignees = [...assignees]
        const [draggedItem] = newAssignees.splice(draggedIndex, 1)
        newAssignees.splice(dropIndex, 0, draggedItem)

        onReorderAssignees?.(newAssignees)
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
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
                    {assignees.map((assignee, index) => {
                        const isPrimary = assignee.id === primaryAssignee?.id
                        const isDragging = draggedIndex === index
                        const isDragOver = dragOverIndex === index
                        
                        return (
                            <div
                                key={assignee.id}
                                draggable={canEdit && assignees.length > 1}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-move ${
                                    isPrimary 
                                        ? 'border-primary/20 bg-primary/5 shadow-sm' 
                                        : 'border-border hover:border-border/60'
                                } ${
                                    isDragging ? 'opacity-50 scale-95' : ''
                                } ${
                                    isDragOver ? 'border-dashed border-primary/40 bg-primary/10' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {canEdit && assignees.length > 1 && (
                                        <div className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <Avatar className={`h-12 w-12 ${isPrimary ? 'ring-2 ring-primary/20' : ''}`}>
                                            <AvatarImage src={assignee.user.avatar} />
                                            <AvatarFallback className={isPrimary ? 'bg-primary/10 text-primary' : ''}>
                                                {getInitials(assignee.user.firstName, assignee.user.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isPrimary && (
                                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                                                <Crown className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium">
                                                {assignee.user.firstName} {assignee.user.lastName}
                                            </div>
                                            {isPrimary && (
                                                <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                                                    <Crown className="h-3 w-3 mr-1" />
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {assignee.user.email}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <UserCheck className="h-3 w-3" />
                                                <span>Assigned by {assignee.assignedByUser.firstName} {assignee.assignedByUser.lastName}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatAssignedDate(assignee.assignedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isPrimary && (
                                        <Badge variant="secondary" className="text-xs">
                                            <UserCheck className="h-3 w-3 mr-1" />
                                            Assignee
                                        </Badge>
                                    )}
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
                        )
                    })}
                </div>
            )}

            {assignees.length > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{assignees.length} assignee{assignees.length !== 1 ? 's' : ''} total</span>
                    <div className="flex items-center gap-4">
                        {canEdit && assignees.length > 1 && (
                            <span className="flex items-center gap-1 text-xs">
                                <GripVertical className="h-3 w-3" />
                                Drag to reorder
                            </span>
                        )}
                        {primaryAssignee && (
                            <span className="flex items-center gap-1">
                                <Crown className="h-3 w-3" />
                                {primaryAssignee.user.firstName} {primaryAssignee.user.lastName} is primary
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

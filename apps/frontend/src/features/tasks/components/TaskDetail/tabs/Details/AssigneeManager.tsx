"use client"

import React, { useState } from 'react';
import { Plus, X, User, Edit3 } from 'lucide-react';
import {
    Button,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollArea,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge
} from '@/shared/components/ui';
import { useTaskAssignees } from '../../../../hooks/useTaskAssignees';
import { TaskAssignee, ProjectMember } from '../../../../api/assignee.api';

interface AssigneeManagerProps {
    taskId: string;
    canEdit: boolean;
}

export function AssigneeManager({ taskId, canEdit }: AssigneeManagerProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const {
        assignees = [],
        availableMembers = [],
        projectMembers = [],
        isLoading,
        isMutating,
        addAssignee,
        removeAssignee,
        error
    } = useTaskAssignees(taskId);

    const handleAddAssignee = (userId: string) => {
        addAssignee(userId);
        setIsPopoverOpen(false);
    };

    const handleRemoveAssignee = (userId: string) => {
        removeAssignee(userId);
    };

    const getUserDisplayName = (user: { firstName: string; lastName: string }) => {
        return `${user.firstName} ${user.lastName}`.trim();
    };

    const getUserInitials = (user: { firstName: string; lastName: string }) => {
        return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
    };

    // Show error state if there's an error
    if (error) {
        return (
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Assignees</h4>
                <div className="text-sm text-red-500">
                    Failed to load assignees: {error.message}
                </div>
            </div>
        );
    }

    // Always render the same UI, just conditionally show edit buttons

    return (
        <Card className="border-border hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <User className="h-5 w-5 text-blue-500" />
                    Assignees
                    <Badge variant="secondary" className="ml-auto text-xs px-2 py-1 bg-muted">
                        {assignees.length}
                    </Badge>
                    {/* Edit Button */}
                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                            className="h-6 w-6 p-0 ml-2"
                        >
                            <Edit3 className="h-3 w-3" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Assignee List */}
                <div className="space-y-2">
                    {assignees.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No assignees assigned
                        </div>
                    ) : (
                        assignees.map((assignee) => (
                            <div
                                key={assignee.id}
                                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={assignee.user.avatar} />
                                    <AvatarFallback className="text-xs">
                                        {getUserInitials(assignee.user)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {getUserDisplayName(assignee.user)}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {assignee.user.email}
                                    </div>
                                </div>
                                {/* Remove Button */}
                                {canEdit && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAssignee(assignee.userId)}
                                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                                        disabled={isMutating}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Add Assignee Button */}
                {canEdit && (
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 border-dashed hover:bg-accent hover:border-solid transition-all duration-200 bg-transparent"
                                disabled={isLoading || availableMembers.length === 0}
                                title={availableMembers.length === 0 ? "All members are already assigned" : "Add assignee"}
                            >
                                <Plus className="h-4 w-4" />
                                Add assignee
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2" align="end">
                            <div className="text-xs font-medium text-muted-foreground mb-2">
                                Add member to task
                            </div>
                            {availableMembers.length === 0 ? (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    All project members are already assigned
                                </div>
                            ) : (
                                <ScrollArea className="max-h-48">
                                    <div className="space-y-1">
                                        {availableMembers.map((member) => (
                                            <Button
                                                key={member.id}
                                                variant="ghost"
                                                className="w-full justify-start h-auto p-2"
                                                onClick={() => handleAddAssignee(member.id)}
                                                disabled={isMutating}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={member.avatar} />
                                                        <AvatarFallback className="text-xs">
                                                            {getUserInitials(member)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col items-start">
                                                        <div className="text-sm font-medium">
                                                            {getUserDisplayName(member)}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </PopoverContent>
                    </Popover>
                )}
            </CardContent>
        </Card>
    );
}

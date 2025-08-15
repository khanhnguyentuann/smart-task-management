"use client"

import React, { useState } from 'react';
import { Edit3, Plus, X, User, Check } from 'lucide-react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Badge,
    Separator,
    ScrollArea
} from '@/shared/components/ui';
import { useTaskAssignees } from '../../hooks/useTaskAssignees';
import { TaskAssignee, ProjectMember } from '../../api/assignee.api';

interface AssigneeManagerProps {
    taskId: string;
    canEdit: boolean;
}

export function AssigneeManager({ taskId, canEdit }: AssigneeManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [mode, setMode] = useState<'add' | 'replace'>('add');

    const {
        assignees,
        availableMembers,
        projectMembers,
        isLoading,
        isMutating,
        addAssignee,
        removeAssignee,
        replaceAssignees,
    } = useTaskAssignees(taskId);

    const handleOpenDialog = (dialogMode: 'add' | 'replace') => {
        setMode(dialogMode);
        if (dialogMode === 'replace') {
            setSelectedUserIds(assignees.map(a => a.userId));
        } else {
            setSelectedUserId('');
        }
        setIsOpen(true);
    };

    const handleAddAssignee = () => {
        if (selectedUserId) {
            addAssignee(selectedUserId);
            setSelectedUserId('');
            setIsOpen(false);
        }
    };

    const handleReplaceAssignees = () => {
        replaceAssignees(selectedUserIds);
        setIsOpen(false);
    };

    const handleRemoveAssignee = (userId: string) => {
        removeAssignee(userId);
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const getUserDisplayName = (user: { firstName: string; lastName: string }) => {
        return `${user.firstName} ${user.lastName}`.trim();
    };

    const getUserInitials = (user: { firstName: string; lastName: string }) => {
        return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
    };

    if (!canEdit) {
        return (
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Assignees</h4>
                <div className="space-y-2">
                    {assignees.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No assignees</p>
                    ) : (
                        assignees.map((assignee) => (
                            <div key={assignee.id} className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.user.avatar} />
                                    <AvatarFallback className="text-xs">
                                        {getUserInitials(assignee.user)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{getUserDisplayName(assignee.user)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Assignees</h4>
                <div className="flex items-center gap-1">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog('add')}
                                disabled={isLoading || availableMembers.length === 0}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog('replace')}
                                disabled={isLoading}
                            >
                                <Edit3 className="h-3 w-3" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {mode === 'add' ? 'Add Assignee' : 'Manage Assignees'}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                {mode === 'add' ? (
                                    <>
                                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a team member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableMembers.map((member) => (
                                                    <SelectItem key={member.id} value={member.id}>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-5 w-5">
                                                                <AvatarImage src={member.avatar} />
                                                                <AvatarFallback className="text-xs">
                                                                    {getUserInitials(member)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span>{getUserDisplayName(member)}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsOpen(false)}
                                                disabled={isMutating}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleAddAssignee}
                                                disabled={!selectedUserId || isMutating}
                                            >
                                                {isMutating ? 'Adding...' : 'Add Assignee'}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-sm text-muted-foreground">
                                            Select team members to assign to this task:
                                        </div>
                                        
                                        <ScrollArea className="max-h-60">
                                            <div className="space-y-2">
                                                {projectMembers.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                                                        onClick={() => toggleUserSelection(member.id)}
                                                    >
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={member.avatar} />
                                                                <AvatarFallback className="text-xs">
                                                                    {getUserInitials(member)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="text-sm font-medium">
                                                                    {getUserDisplayName(member)}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {member.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {selectedUserIds.includes(member.id) && (
                                                            <Check className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsOpen(false)}
                                                disabled={isMutating}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleReplaceAssignees}
                                                disabled={isMutating}
                                            >
                                                {isMutating ? 'Updating...' : 'Update Assignees'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="space-y-2">
                {assignees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No assignees</p>
                ) : (
                    assignees.map((assignee) => (
                        <div key={assignee.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.user.avatar} />
                                    <AvatarFallback className="text-xs">
                                        {getUserInitials(assignee.user)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{getUserDisplayName(assignee.user)}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                onClick={() => handleRemoveAssignee(assignee.userId)}
                                disabled={isMutating}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

"use client"

import React, { useState } from 'react';
import { Plus, X, User, Edit3, Loader2 } from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/shared/components/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

interface AssigneeManagerProps {
    assignees: any[]
    availableMembers: any[]
    canEdit: boolean
    isLoading?: boolean
    isMutating?: boolean
    onAddAssignee?: (userId: string) => void
    onRemoveAssignee?: (userId: string) => void
}

export function AssigneeManager({ 
    assignees, 
    availableMembers, 
    canEdit, 
    isLoading = false, 
    isMutating = false,
    onAddAssignee,
    onRemoveAssignee
}: AssigneeManagerProps) {
    console.log('🔍 AssigneeManager: assignees data:', assignees);
    console.log('🔍 AssigneeManager: availableMembers data:', availableMembers);
    const [editMode, setEditMode] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState("");

    const handleAddAssignee = (userId: string) => {
        if (onAddAssignee) {
            onAddAssignee(userId);
            setSelectedMemberId("");
        }
    };

    const handleRemoveAssignee = (userId: string) => {
        if (onRemoveAssignee) {
            onRemoveAssignee(userId);
        }
    };

    const getUserDisplayName = (user: { firstName: string; lastName: string }) => {
        return `${user.firstName} ${user.lastName}`.trim();
    };

    const hasEditPermission = () => {
        return canEdit;
    };

    return (
        <TooltipProvider>
            <Card className="border-border hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <User className="h-5 w-5 text-blue-500" />
                        {assignees.length} assignees
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => hasEditPermission() && setEditMode(!editMode)}
                                    disabled={!hasEditPermission()}
                                    className="h-8 w-8 p-0 ml-auto"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            {!hasEditPermission() && (
                                <TooltipContent>
                                    <p>Bạn chỉ có thể chỉnh khi là Maintainer/Owner</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {assignees.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Chưa có ai được giao. Thêm người để bắt đầu.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {assignees.map((assignee) => (
                                <div key={assignee.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {getUserDisplayName(assignee.user)}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {assignee.user.email}
                                        </p>
                                    </div>
                                    {editMode && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveAssignee(assignee.userId)}
                                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                                            disabled={isMutating}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {editMode && availableMembers.length > 0 && (
                        <Select
                            value={selectedMemberId}
                            onValueChange={(value) => {
                                setSelectedMemberId(value);
                                const selectedMember = availableMembers.find((m) => m.id === value);
                                if (selectedMember && !assignees.find((a) => a.id === selectedMember.id)) {
                                    handleAddAssignee(selectedMember.id);
                                }
                            }}
                        >
                            <SelectTrigger className="w-full border-dashed hover:bg-accent hover:border-solid transition-all duration-200 bg-transparent">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    <SelectValue placeholder="Nhập tên hoặc email..." />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {availableMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                <User className="h-3 w-3 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">
                                                    {getUserDisplayName(member)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {member.email}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}

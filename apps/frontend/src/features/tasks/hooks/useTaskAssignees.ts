import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assigneeApi, TaskAssignee, ProjectMember, AddAssigneeRequest, ReplaceAssigneesRequest } from '../api/assignee.api';
import { useToast } from '@/shared/hooks';

export function useTaskAssignees(taskId: string) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Get task assignees
    const {
        data: assignees = [],
        isLoading: isLoadingAssignees,
        error: assigneesError,
        refetch: refetchAssignees
    } = useQuery({
        queryKey: ['task-assignees', taskId],
        queryFn: () => assigneeApi.getTaskAssignees(taskId),
        enabled: !!taskId,
    });

    // Get project members for dropdown
    const {
        data: projectMembers = [],
        isLoading: isLoadingMembers,
        error: membersError
    } = useQuery({
        queryKey: ['project-members', taskId],
        queryFn: () => assigneeApi.getProjectMembers(taskId),
        enabled: !!taskId,
    });

    // Replace all assignees mutation
    const replaceAssigneesMutation = useMutation({
        mutationFn: (data: ReplaceAssigneesRequest) => assigneeApi.replaceTaskAssignees(taskId, data),
        onSuccess: (data) => {
            queryClient.setQueryData(['task-assignees', taskId], data);
            toast({
                title: 'Success',
                description: 'Assignees updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update assignees',
                variant: 'destructive',
            });
        },
    });

    // Add single assignee mutation
    const addAssigneeMutation = useMutation({
        mutationFn: (data: AddAssigneeRequest) => assigneeApi.addTaskAssignee(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task-assignees', taskId] });
            toast({
                title: 'Success',
                description: 'Assignee added successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add assignee',
                variant: 'destructive',
            });
        },
    });

    // Remove assignee mutation
    const removeAssigneeMutation = useMutation({
        mutationFn: (userId: string) => assigneeApi.removeTaskAssignee(taskId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task-assignees', taskId] });
            toast({
                title: 'Success',
                description: 'Assignee removed successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove assignee',
                variant: 'destructive',
            });
        },
    });

    // Helper functions
    const replaceAssignees = useCallback((userIds: string[]) => {
        replaceAssigneesMutation.mutate({ userIds });
    }, [replaceAssigneesMutation]);

    const addAssignee = useCallback((userId: string) => {
        addAssigneeMutation.mutate({ userId });
    }, [addAssigneeMutation]);

    const removeAssignee = useCallback((userId: string) => {
        removeAssigneeMutation.mutate(userId);
    }, [removeAssigneeMutation]);

    // Get available members (not already assigned)
    const availableMembers = projectMembers.filter(member => 
        !assignees.some(assignee => assignee.userId === member.id)
    );

    return {
        // Data
        assignees,
        projectMembers,
        availableMembers,

        // Loading states
        isLoadingAssignees,
        isLoadingMembers,
        isLoading: isLoadingAssignees || isLoadingMembers,

        // Mutation states
        isReplacing: replaceAssigneesMutation.isPending,
        isAdding: addAssigneeMutation.isPending,
        isRemoving: removeAssigneeMutation.isPending,
        isMutating: replaceAssigneesMutation.isPending || addAssigneeMutation.isPending || removeAssigneeMutation.isPending,

        // Errors
        error: assigneesError || membersError,

        // Actions
        replaceAssignees,
        addAssignee,
        removeAssignee,
        refetchAssignees,
    };
}

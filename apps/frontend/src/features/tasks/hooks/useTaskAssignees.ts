import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assigneeService } from '../services/assignee.service';
import { AddAssigneeRequest, ReplaceAssigneesRequest, TaskAssignee, ProjectMember } from '../api/assignee.api';
import { useToast } from '@/shared/hooks';
import { TASKS_CONSTANTS } from '@/shared/constants';

export function useTaskAssignees(taskId: string, onAssigneesChange?: () => void) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Get task assignees
    const {
        data: assignees = [],
        isLoading: isLoadingAssignees,
        error: assigneesError,
        refetch: refetchAssignees
    } = useQuery({
        queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_ASSIGNEES(taskId),
        queryFn: async () => {
            if (!taskId) return [];
            const result = await assigneeService.getTaskAssignees(taskId);
            return result;
        },
        enabled: !!taskId,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Get project members for dropdown
    const {
        data: projectMembers = [],
        isLoading: isLoadingMembers,
        error: membersError
    } = useQuery({
        queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECT_MEMBERS(taskId),
        queryFn: async () => {
            if (!taskId) return [];
            return await assigneeService.getProjectMembers(taskId);
        },
        enabled: !!taskId,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Replace all assignees mutation
    const replaceAssigneesMutation = useMutation({
        mutationFn: (data: ReplaceAssigneesRequest) => assigneeService.replaceTaskAssignees(taskId, data),
        onSuccess: (data) => {
            // Invalidate queries to refresh data from server (safer approach)
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_ASSIGNEES(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS }); // Update task lists
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS }); // Update project task lists
            // Call callback to refresh other hooks
            onAssigneesChange?.();
            toast({
                title: 'Success',
                description: TASKS_CONSTANTS.MESSAGES.ASSIGNEE_UPDATE_SUCCESS,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || TASKS_CONSTANTS.MESSAGES.ASSIGNEE_UPDATE_FAILED,
                variant: 'destructive',
            });
        },
    });

    // Add single assignee mutation
    const addAssigneeMutation = useMutation({
        mutationFn: (data: AddAssigneeRequest) => assigneeService.addTaskAssignee(taskId, data),
        onSuccess: (newAssignee) => {
            // Invalidate queries to refresh data from server (safer approach)
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_ASSIGNEES(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS }); // Update task lists
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS }); // Update project task lists
            // Call callback to refresh other hooks
            onAssigneesChange?.();
            toast({
                title: 'Success',
                description: TASKS_CONSTANTS.MESSAGES.ASSIGNEE_ADD_SUCCESS,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || TASKS_CONSTANTS.MESSAGES.ASSIGNEE_ADD_FAILED,
                variant: 'destructive',
            });
        },
    });

    // Remove assignee mutation
    const removeAssigneeMutation = useMutation({
        mutationFn: (userId: string) => assigneeService.removeTaskAssignee(taskId, userId),
        onSuccess: (_, userId) => {
            // Invalidate queries to refresh data from server (safer approach)
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_ASSIGNEES(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS }); // Update task lists
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS }); // Update project task lists
            // Call callback to refresh other hooks
            onAssigneesChange?.();
            toast({
                title: 'Success',
                description: TASKS_CONSTANTS.MESSAGES.ASSIGNEE_REMOVE_SUCCESS,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || TASKS_CONSTANTS.MESSAGES.ASSIGNEE_REMOVE_FAILED,
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

        // Get available members (not already assigned) - computed from service
    const availableMembers = useMemo(() => 
        assigneeService.getAvailableMembers(projectMembers, assignees), 
        [projectMembers, assignees]
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

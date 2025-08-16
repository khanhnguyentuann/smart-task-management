import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subtaskService } from '../services/subtask.service';
import { CreateSubtaskRequest, UpdateSubtaskRequest, TaskSubtask } from '../api/subtask.api';
import { useToast } from '@/shared/hooks';
import { TASKS_CONSTANTS } from '@/shared/constants';

export function useTaskSubtasks(taskId: string, onSubtasksChange?: () => void) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const {
        data: subtasks = [],
        isLoading: isLoadingSubtasks,
        error: subtasksError,
        refetch: refetchSubtasks
    } = useQuery({
        queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_SUBTASKS(taskId),
        queryFn: async () => {
            if (!taskId) return [];
            const result = await subtaskService.getTaskSubtasks(taskId);
            return result;
        },
        enabled: !!taskId,
        retry: TASKS_CONSTANTS.CACHE_TIMES.RETRY_COUNT,
        staleTime: TASKS_CONSTANTS.CACHE_TIMES.STALE_TIME,
    });

    const createSubtaskMutation = useMutation({
        mutationFn: (data: CreateSubtaskRequest) => subtaskService.createSubtask(taskId, data),
        onSuccess: (newSubtask) => {
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_SUBTASKS(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS });
            onSubtasksChange?.();
            toast({ title: 'Success', description: TASKS_CONSTANTS.MESSAGES.SUBTASK_CREATE_SUCCESS, });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || TASKS_CONSTANTS.MESSAGES.SUBTASK_CREATE_FAILED, variant: 'destructive', });
        },
    });

    const updateSubtaskMutation = useMutation({
        mutationFn: ({ subtaskId, data }: { subtaskId: string; data: UpdateSubtaskRequest }) =>
            subtaskService.updateSubtask(taskId, subtaskId, data),
        onSuccess: (updatedSubtask) => {
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_SUBTASKS(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS });
            onSubtasksChange?.();
            toast({ title: 'Success', description: TASKS_CONSTANTS.MESSAGES.SUBTASK_UPDATE_SUCCESS, });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || TASKS_CONSTANTS.MESSAGES.SUBTASK_UPDATE_FAILED, variant: 'destructive', });
        },
    });

    const deleteSubtaskMutation = useMutation({
        mutationFn: (subtaskId: string) => subtaskService.deleteSubtask(taskId, subtaskId),
        onSuccess: (_, subtaskId) => {
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_SUBTASKS(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS });
            onSubtasksChange?.();
            toast({ title: 'Success', description: TASKS_CONSTANTS.MESSAGES.SUBTASK_DELETE_SUCCESS, });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || TASKS_CONSTANTS.MESSAGES.SUBTASK_DELETE_FAILED, variant: 'destructive', });
        },
    });

    const createSubtask = useCallback((title: string, description?: string, status?: string, priority?: string, dueDate?: string) => {
        const subtaskData: CreateSubtaskRequest = {
            title: title.trim(),
            description: description?.trim(),
            status: status as any,
            priority: priority as any,
            dueDate,
        };
        if (!subtaskService.validateSubtaskData(subtaskData.title, subtaskData.description)) {
            toast({ title: 'Validation Error', description: 'Subtask title is required and must be less than 200 characters', variant: 'destructive', });
            return;
        }
        createSubtaskMutation.mutate(subtaskData);
    }, [createSubtaskMutation, toast]);

    const updateSubtask = useCallback((subtaskId: string, data: UpdateSubtaskRequest) => {
        updateSubtaskMutation.mutate({ subtaskId, data });
    }, [updateSubtaskMutation]);

    const deleteSubtask = useCallback((subtaskId: string) => {
        deleteSubtaskMutation.mutate(subtaskId);
    }, [deleteSubtaskMutation]);

    const toggleSubtaskStatus = useCallback((subtaskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
        updateSubtaskMutation.mutate({ subtaskId, data: { status: newStatus as any } });
    }, [updateSubtaskMutation]);

    const progress = useMemo(() => {
        return subtaskService.getSubtaskProgress(subtasks);
    }, [subtasks]);

    return {
        subtasks,
        progress,
        isLoadingSubtasks,
        isLoading: isLoadingSubtasks,
        isCreating: createSubtaskMutation.isPending,
        isUpdating: updateSubtaskMutation.isPending,
        isDeleting: deleteSubtaskMutation.isPending,
        isMutating: createSubtaskMutation.isPending || updateSubtaskMutation.isPending || deleteSubtaskMutation.isPending,
        error: subtasksError,
        createSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtaskStatus,
        refetchSubtasks,
    };
}

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labelService } from '../services/label.service';
import { CreateLabelRequest, UpdateLabelRequest, TaskLabel } from '../api/label.api';
import { useToast } from '@/shared/hooks';
import { TASKS_CONSTANTS } from '@/shared/constants';

export function useTaskLabels(taskId: string, onLabelsChange?: () => void) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Get task labels
    const {
        data: labels = [],
        isLoading: isLoadingLabels,
        error: labelsError,
        refetch: refetchLabels
    } = useQuery({
        queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_LABELS(taskId),
        queryFn: async () => {
            if (!taskId) return [];
            const result = await labelService.getTaskLabels(taskId);
            return result;
        },
        enabled: !!taskId,
        retry: TASKS_CONSTANTS.CACHE_TIMES.RETRY_COUNT,
        staleTime: TASKS_CONSTANTS.CACHE_TIMES.STALE_TIME,
    });

    // Create label mutation
    const createLabelMutation = useMutation({
        mutationFn: (data: CreateLabelRequest) => labelService.createTaskLabel(taskId, data),
        onSuccess: (newLabel) => {
            // Invalidate queries to refresh data from server
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_LABELS(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS });
            // Call callback to refresh other hooks
            onLabelsChange?.();
            toast({
                title: 'Success',
                description: TASKS_CONSTANTS.MESSAGES.LABEL_CREATE_SUCCESS,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || TASKS_CONSTANTS.MESSAGES.LABEL_CREATE_FAILED,
                variant: 'destructive',
            });
        },
    });

    // Update label mutation
    const updateLabelMutation = useMutation({
        mutationFn: ({ labelId, data }: { labelId: string; data: UpdateLabelRequest }) => 
            labelService.updateTaskLabel(taskId, labelId, data),
        onSuccess: (updatedLabel) => {
            // Invalidate queries to refresh data from server
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_LABELS(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS });
            // Call callback to refresh other hooks
            onLabelsChange?.();
            toast({
                title: 'Success',
                description: TASKS_CONSTANTS.MESSAGES.LABEL_UPDATE_SUCCESS,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || TASKS_CONSTANTS.MESSAGES.LABEL_UPDATE_FAILED,
                variant: 'destructive',
            });
        },
    });

    // Delete label mutation
    const deleteLabelMutation = useMutation({
        mutationFn: (labelId: string) => labelService.deleteTaskLabel(taskId, labelId),
        onSuccess: (_, labelId) => {
            // Invalidate queries to refresh data from server
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASK_LABELS(taskId) });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.TASKS });
            queryClient.invalidateQueries({ queryKey: TASKS_CONSTANTS.QUERY_KEYS.PROJECTS });
            // Call callback to refresh other hooks
            onLabelsChange?.();
            toast({
                title: 'Success',
                description: TASKS_CONSTANTS.MESSAGES.LABEL_DELETE_SUCCESS,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || TASKS_CONSTANTS.MESSAGES.LABEL_DELETE_FAILED,
                variant: 'destructive',
            });
        },
    });

    // Helper functions
    const createLabel = useCallback((name: string, color?: string) => {
        const labelData: CreateLabelRequest = {
            name: name.trim(),
            color: color || labelService.generateRandomColor()
        };
        
        if (!labelService.validateLabelData(labelData.name, labelData.color)) {
            toast({
                title: 'Validation Error',
                description: 'Label name and color are required',
                variant: 'destructive',
            });
            return;
        }
        
        createLabelMutation.mutate(labelData);
    }, [createLabelMutation, toast]);

    const updateLabel = useCallback((labelId: string, data: UpdateLabelRequest) => {
        updateLabelMutation.mutate({ labelId, data });
    }, [updateLabelMutation]);

    const deleteLabel = useCallback((labelId: string) => {
        deleteLabelMutation.mutate(labelId);
    }, [deleteLabelMutation]);

    // Get available colors (not used by existing labels)
    const availableColors = useMemo(() => {
        const usedColors = new Set(labels.map(label => label.color));
        const allColors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
            'bg-red-500', 'bg-yellow-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
        ];
        return allColors.filter(color => !usedColors.has(color));
    }, [labels]);

    return {
        // Data
        labels,
        availableColors,

        // Loading states
        isLoadingLabels,
        isLoading: isLoadingLabels,

        // Mutation states
        isCreating: createLabelMutation.isPending,
        isUpdating: updateLabelMutation.isPending,
        isDeleting: deleteLabelMutation.isPending,
        isMutating: createLabelMutation.isPending || updateLabelMutation.isPending || deleteLabelMutation.isPending,

        // Errors
        error: labelsError,

        // Actions
        createLabel,
        updateLabel,
        deleteLabel,
        refetchLabels,
    };
}

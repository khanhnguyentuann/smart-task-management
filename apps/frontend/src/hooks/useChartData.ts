import { useMemo } from 'react'

export interface TaskStatusData {
    todo: number
    inProgress: number
    done: number
}

export interface PriorityData {
    low: number
    medium: number
    high: number
}

export interface ProgressData {
    labels: string[]
    completed: number[]
    total: number[]
}

export interface ProjectData {
    labels: string[]
    tasks: number[]
    completed: number[]
}

export function useChartData() {
    const taskStatusData = useMemo<TaskStatusData>(() => ({
        todo: 12,
        inProgress: 8,
        done: 25
    }), [])

    const priorityData = useMemo<PriorityData>(() => ({
        low: 8,
        medium: 15,
        high: 7
    }), [])

    const progressData = useMemo<ProgressData>(() => ({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        completed: [5, 8, 12, 15, 18, 22, 25],
        total: [30, 32, 35, 38, 40, 42, 45]
    }), [])

    const projectData = useMemo<ProjectData>(() => ({
        labels: ['Project A', 'Project B', 'Project C', 'Project D'],
        tasks: [15, 12, 8, 10],
        completed: [10, 8, 6, 7]
    }), [])

    return {
        taskStatusData,
        priorityData,
        progressData,
        projectData
    }
} 
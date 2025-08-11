"use client"

import { TaskCard } from "@/features/tasks/components/MyTasks/TaskCard"

interface ProjectTaskItemProps {
    task: any
    onClick: () => void
}

export function ProjectTaskItem({ task, onClick }: ProjectTaskItemProps) {
    return (
        <TaskCard
            task={task}
            onClick={onClick}
        />
    )
}

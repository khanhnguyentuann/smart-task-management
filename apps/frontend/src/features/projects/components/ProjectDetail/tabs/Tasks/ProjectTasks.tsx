"use client"

import { useMemo } from "react"
import { Clock, AlertTriangle, CheckSquare } from "lucide-react"
import { ProjectTaskItem } from "./ProjectTaskItem"
import { PROJECTS_CONSTANTS } from "../../../../lib"

interface ProjectTasksProps {
    tasks: any[]
    project: any
    onTaskClick: (task: any) => void
}

export function ProjectTasks({ tasks, project, onTaskClick }: ProjectTasksProps) {
    const tasksByStatus = useMemo(() => ({
        todo: tasks.filter((task) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.TODO),
        inProgress: tasks.filter((task) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.IN_PROGRESS),
        done: tasks.filter((task) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.DONE),
    }), [tasks])

    const toUiTask = (task: any) => {
        const priorityMap: Record<string, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }
        const statusMap: Record<string, string> = { TODO: 'todo', IN_PROGRESS: 'inProgress', DONE: 'done' }
        const assigneeFullName = task.assignee?.firstName || task.assignee?.lastName
            ? `${task.assignee?.firstName || ''} ${task.assignee?.lastName || ''}`.trim()
            : undefined
        return {
            id: task.id,
            title: task.title,
            aiSummary: task.summary || '',
            priority: priorityMap[task.priority] || 'Medium',
            status: statusMap[task.status] || 'todo',
            project: project?.name || '',
            deadline: (task as any).dueDate || task.deadline || '',
            assignee: {
                name: assigneeFullName || task.assignee?.email || 'Unassigned',
                avatar: task.assignee?.avatar || '',
            },
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* To Do Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        To Do ({tasksByStatus.todo.length})
                    </h3>
                </div>
                <div className="space-y-3">
                    {tasksByStatus.todo.map((task) => (
                        <ProjectTaskItem
                            key={task.id}
                            task={toUiTask(task)}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        In Progress ({tasksByStatus.inProgress.length})
                    </h3>
                </div>
                <div className="space-y-3">
                    {tasksByStatus.inProgress.map((task) => (
                        <ProjectTaskItem
                            key={task.id}
                            task={toUiTask(task)}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </div>
            </div>

            {/* Done Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-500" />
                        Done ({tasksByStatus.done.length})
                    </h3>
                </div>
                <div className="space-y-3">
                    {tasksByStatus.done.map((task) => (
                        <ProjectTaskItem
                            key={task.id}
                            task={toUiTask(task)}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

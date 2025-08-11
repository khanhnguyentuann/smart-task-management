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

    // If no tasks have proper status, show all tasks in todo column
    const hasProperStatus = tasks.some(task => 
        task.status === PROJECTS_CONSTANTS.TASK_STATUS.TODO ||
        task.status === PROJECTS_CONSTANTS.TASK_STATUS.IN_PROGRESS ||
        task.status === PROJECTS_CONSTANTS.TASK_STATUS.DONE
    )

    const displayTasks = hasProperStatus ? tasksByStatus : {
        todo: tasks,
        inProgress: [],
        done: []
    }

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

    if (tasks.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks found in this project.</p>
                <p className="text-sm text-muted-foreground mt-2">Create your first task to get started.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* To Do Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        To Do ({displayTasks.todo.length})
                    </h3>
                </div>
                <div className="space-y-3">
                    {displayTasks.todo.map((task) => (
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
                        In Progress ({displayTasks.inProgress.length})
                    </h3>
                </div>
                <div className="space-y-3">
                    {displayTasks.inProgress.map((task) => (
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
                        Done ({displayTasks.done.length})
                    </h3>
                </div>
                <div className="space-y-3">
                    {displayTasks.done.map((task) => (
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

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
        
        // Handle multi-assignee data
        const assignees = task.assignees || []
        let assigneeDisplay = { name: 'Unassigned', avatar: '' }
        
        if (assignees.length > 0) {
            const firstAssignee = assignees[0]
            const firstName = firstAssignee.user?.firstName || ''
            const lastName = firstAssignee.user?.lastName || ''
            const fullName = `${firstName} ${lastName}`.trim()
            
            if (assignees.length === 1) {
                assigneeDisplay = {
                    name: fullName || firstAssignee.user?.email || 'Assigned',
                    avatar: firstAssignee.user?.avatar || '',
                }
            } else {
                assigneeDisplay = {
                    name: `${fullName || 'User'} +${assignees.length - 1} more`,
                    avatar: firstAssignee.user?.avatar || '',
                }
            }
        }
        
        return {
            id: task.id,
            title: task.title,
            aiSummary: task.summary || '',
            priority: priorityMap[task.priority] || 'Medium',
            status: statusMap[task.status] || 'todo',
            project: project?.name || '',
            deadline: (task as any).dueDate || task.deadline || '',
            assignee: assigneeDisplay,
            assignees: assignees, // Keep original assignees data for detailed view
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

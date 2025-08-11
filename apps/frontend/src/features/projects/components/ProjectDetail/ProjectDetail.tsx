"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card/Card"
import { Button } from "@/shared/components/ui/button/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ArrowLeft, Plus, Users, Settings, CheckSquare, Edit } from "lucide-react"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal"
import { EditProjectModal } from "../Modals/EditProjectModal"
import { AddMemberModal, ProjectMembers, RemoveMemberConfirm } from "./tabs/Members"
import { ProjectTasks } from "./tabs/Tasks"
import { ProjectSettings } from "./tabs/Settings"
import { PROJECTS_CONSTANTS } from "../../lib"
import { ProjectDetailProps } from "../../lib"
import { useProjectDetail } from "../../hooks/useProjectDetail"
import { useProjectTasks } from "../../hooks/useProjectTasks"
import { useProjectMembers } from "../../hooks/useProjectMembers"
import { useProjectForm } from "../../hooks/useProjectForm"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

export function ProjectDetail({ projectId, onBack }: Omit<ProjectDetailProps, 'user'>) {
    const { user } = useUser()
    const router = useRouter()
    const [showCreateTask, setShowCreateTask] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [confirmKickMember, setConfirmKickMember] = useState<{ open: boolean; memberId?: string; memberName?: string | null }>({ open: false })
    const [tasks, setTasks] = useState<any[]>([])

    // Use hooks instead of direct API calls
    const { project, loading, error, refreshProject } = useProjectDetail(projectId)
    const { getProjectTasks, createProjectTask } = useProjectTasks()
    const { removeProjectMember } = useProjectMembers()
    const { updateProject } = useProjectForm()

    const loadTasks = useCallback(async () => {
        if (!projectId) return
        try {
            const tasksData = await getProjectTasks(projectId)
            setTasks(Array.isArray(tasksData) ? tasksData : [])
        } catch (error) {
            console.error("Failed to load tasks:", error)
        }
    }, [projectId, getProjectTasks])

    // Load tasks when projectId changes
    useEffect(() => {
        if (projectId) {
            loadTasks()
        }
    }, [projectId, loadTasks])

    const refreshTasks = async () => {
        await loadTasks()
    }

    const tasksByStatus = useMemo(() => ({
        todo: tasks.filter((task: any) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.TODO),
        inProgress: tasks.filter((task: any) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.IN_PROGRESS),
        done: tasks.filter((task: any) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.DONE),
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

    const handleTaskClick = (task: any) => {
        // Navigate to task detail page instead of showing inline
        router.push(`/my-tasks/${task.id}`)
    }

    const handleKickMember = useCallback(async (memberId: string) => {
        if (!projectId) return
        try {
            await removeProjectMember(projectId, memberId)
            await refreshProject()
            setConfirmKickMember({ open: false })
        } catch (error) {
            console.error("Failed to remove member:", error)
        }
    }, [projectId, removeProjectMember, refreshProject])

    const handleUpdateProject = useCallback(async (projectData: any) => {
        if (!projectId) return
        try {
            await updateProject(projectId, projectData)
            await refreshProject()
            setShowEditModal(false)
        } catch (error) {
            console.error("Failed to update project:", error)
        }
    }, [projectId, updateProject, refreshProject])


    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-6">
                        <SidebarTrigger />
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Projects
                        </Button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    Loading project...
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="flex flex-col h-full">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-6">
                        <SidebarTrigger />
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Projects
                        </Button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
                        <Button onClick={onBack}>Go Back</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-6">
                    <SidebarTrigger />
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">{project.name}</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                    {/* Project Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{project.name}</CardTitle>
                                    <p className="text-muted-foreground mt-2">{project.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {project.members?.slice(0, 3).map((m: any, index: number) => (
                                            <div key={index} className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                                {(m.user?.firstName || "").charAt(0)}
                                                {(m.user?.lastName || "").charAt(0)}
                                            </div>
                                        ))}
                                        {project.members && project.members.length > 3 && (
                                            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                                +{project.members.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {project.ownerId === user?.id && (
                                            <Button onClick={() => setShowCreateTask(true)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Task
                                            </Button>
                                        )}
                                        {project.ownerId === user?.id && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowEditModal(true)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="tasks" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="tasks" className="flex items-center gap-2">
                                <CheckSquare className="h-4 w-4" />
                                Tasks
                            </TabsTrigger>
                            <TabsTrigger value="members" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Members
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tasks" className="space-y-4">
                            <ProjectTasks
                                tasks={tasks}
                                project={project}
                                onTaskClick={handleTaskClick}
                            />
                        </TabsContent>

                        <TabsContent value="members" className="space-y-4">
                            <ProjectMembers
                                project={project}
                                onAddMember={() => setShowAddMember(true)}
                                onRemoveMember={(memberId, memberName) => setConfirmKickMember({
                                    open: true,
                                    memberId,
                                    memberName
                                })}
                            />
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                            <ProjectSettings project={project} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <CreateTaskModal
                open={showCreateTask}
                onOpenChange={setShowCreateTask}
                projectId={projectId}
                members={(project?.members || []).map((m: any) => ({ id: m.user?.id, name: `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim() }))}
                onCreated={refreshTasks}
            />

            {/* Add Member Modal */}
            {projectId && (
                <AddMemberModal
                    open={showAddMember}
                    onOpenChange={setShowAddMember}
                    projectId={projectId}
                    onAdded={refreshProject}
                />
            )}

            {/* Edit Project Modal */}
            <EditProjectModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                currentUser={user}
                project={project}
                onUpdated={handleUpdateProject}
            />

            {/* Confirm Kick Member Dialog */}
            <RemoveMemberConfirm
                open={confirmKickMember.open}
                memberName={confirmKickMember.memberName || 'this member'}
                onOpenChange={(open) => setConfirmKickMember({ open, memberId: undefined, memberName: undefined })}
                onConfirm={() => confirmKickMember.memberId && handleKickMember(confirmKickMember.memberId)}
            />
        </div>
    )
}
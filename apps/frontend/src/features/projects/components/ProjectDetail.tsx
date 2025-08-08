"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card/Card"
import { Button } from "@/shared/components/ui/button/Button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ArrowLeft, Plus, Users, Settings, CheckSquare, Clock, AlertTriangle, Sparkles, UserPlus, UserMinus } from "lucide-react"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal"
import { AnimatedTaskCard } from "@/shared/components/ui/animated-task-card"
import { TaskDetail } from "@/features/tasks/components/TaskDetail"
import { AddMemberModal } from "./AddMemberModal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog"
import { PROJECTS_CONSTANTS } from "../constants"
import { ProjectDetailProps } from "../types"
import { apiService } from "@/core/services/api"

export function ProjectDetail({ projectId, user, onBack }: ProjectDetailProps) {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<any | null>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; taskId?: string }>({ open: false })
  const [showAddMember, setShowAddMember] = useState(false)
  const [confirmKickMember, setConfirmKickMember] = useState<{ open: boolean; memberId?: string; memberName?: string | null }>({ open: false })

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      if (!projectId) return
      try {
        setLoading(true)
        setError(null)
        const projResp = await apiService.getProject(projectId)
        const projData = (projResp as any).data || projResp
        const tasksResp = await apiService.getProjectTasks(projectId)
        const tasksData = (tasksResp as any).data || tasksResp
        const tasksArray = Array.isArray(tasksData) ? tasksData : tasksData?.tasks
        if (!isMounted) return
        setProject(projData)
        setTasks(Array.isArray(tasksArray) ? tasksArray : [])
      } catch (e: any) {
        if (!isMounted) return
        setError(e.message || 'Failed to load project detail')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [projectId])

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter((task) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.TODO),
    inProgress: tasks.filter((task) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.IN_PROGRESS),
    done: tasks.filter((task) => task.status === PROJECTS_CONSTANTS.TASK_STATUS.DONE),
  }), [tasks])

  const toUiTask = (task: any) => {
    const priorityMap: Record<string, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }
    const statusMap: Record<string, string> = { TODO: 'todo', IN_PROGRESS: 'inProgress', DONE: 'done' }
    return {
      id: task.id,
      title: task.title,
      aiSummary: task.summary || '',
      priority: priorityMap[task.priority] || 'Medium',
      status: statusMap[task.status] || 'todo',
      project: project?.name || '',
      deadline: task.deadline || '',
      assignee: {
        name: task.assignee?.email || 'Unassigned',
        avatar: '',
      },
    }
  }

  const handleTaskClick = (task: any) => {
    setSelectedTaskId(task.id)
  }

  const handleBackFromTask = () => {
    setSelectedTaskId(null)
  }

  const refreshTasks = useCallback(async () => {
    if (!projectId) return
    try {
      const tasksResp = await apiService.getProjectTasks(projectId)
      const tasksData = (tasksResp as any).data || tasksResp
      const tasksArray = Array.isArray(tasksData) ? tasksData : tasksData?.tasks
      setTasks(Array.isArray(tasksArray) ? tasksArray : [])
    } catch (error) {
      console.error("Failed to refresh tasks:", error)
    }
  }, [projectId])

  const refreshProject = useCallback(async () => {
    if (!projectId) return
    try {
      const projResp = await apiService.getProject(projectId)
      const projData = (projResp as any).data || projResp
      setProject(projData)
    } catch (error) {
      console.error("Failed to refresh project:", error)
    }
  }, [projectId])

  const handleKickMember = useCallback(async (memberId: string) => {
    if (!projectId) return
    try {
      await apiService.removeProjectMember(projectId, memberId)
      await refreshProject()
      setConfirmKickMember({ open: false })
    } catch (error) {
      console.error("Failed to kick member:", error)
    }
  }, [projectId, refreshProject])

  if (selectedTaskId) {
    return (
      <TaskDetail 
        taskId={selectedTaskId} 
        user={user} 
        onBack={handleBackFromTask}
        onDelete={refreshTasks}
      />
    )
  }

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
                    {project.projectUsers?.slice(0, 3).map((pu: any, index: number) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={"/placeholder.svg"} alt={`${pu.user?.firstName} ${pu.user?.lastName}`} />
                        <AvatarFallback>
                          {(pu.user?.firstName || "").charAt(0)}
                          {(pu.user?.lastName || "").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.projectUsers && project.projectUsers.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{project.projectUsers.length - 3}
                      </div>
                    )}
                  </div>
                  {project.ownerId === project.currentUserId && (
                  <Button onClick={() => setShowCreateTask(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  )}
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
              {/* Task Board */}
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
                      <AnimatedTaskCard key={task.id} task={toUiTask(task) as any} onClick={() => handleTaskClick(task)} />
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
                      <AnimatedTaskCard key={task.id} task={toUiTask(task) as any} onClick={() => handleTaskClick(task)} />
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
                      <AnimatedTaskCard key={task.id} task={toUiTask(task) as any} onClick={() => handleTaskClick(task)} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Members</CardTitle>
                    {project.ownerId === project.currentUserId && (
                      <Button onClick={() => setShowAddMember(true)} size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.projectUsers?.map((pu: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={"/placeholder.svg"} alt={`${pu.user?.firstName} ${pu.user?.lastName}`} />
                            <AvatarFallback>
                              {(pu.user?.firstName || "").charAt(0)}
                              {(pu.user?.lastName || "").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{pu.user?.firstName} {pu.user?.lastName}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant={pu.user?.id === project.ownerId ? "default" : "secondary"}>
                                {pu.user?.id === project.ownerId ? "Owner" : "Member"}
                              </Badge>
                              {pu.user?.email && (
                                <span className="text-xs text-muted-foreground">{pu.user.email}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {project.ownerId === project.currentUserId && pu.user?.id !== project.ownerId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmKickMember({ 
                              open: true, 
                              memberId: pu.user?.id, 
                              memberName: `${pu.user?.firstName} ${pu.user?.lastName}` 
                            })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Project settings will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateTaskModal
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        projectId={projectId}
        user={user}
        members={(project?.projectUsers || []).map((pu: any) => ({ id: pu.user?.id, name: `${pu.user?.firstName || ''} ${pu.user?.lastName || ''}`.trim() }))}
        onCreated={async () => {
          if (!projectId) return
          try {
            const tasksResp = await apiService.getProjectTasks(projectId)
            const tasksData = (tasksResp as any).data || tasksResp
            const tasksArray = Array.isArray(tasksData) ? tasksData : tasksData?.tasks
            setTasks(Array.isArray(tasksArray) ? tasksArray : [])
          } catch {}
        }}
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

      {/* Confirm Kick Member Dialog */}
      <AlertDialog open={confirmKickMember.open} onOpenChange={(open) => setConfirmKickMember({ open, memberId: undefined, memberName: undefined })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {confirmKickMember.memberName ? `"${confirmKickMember.memberName}"` : 'this member'} from this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmKickMember.memberId && handleKickMember(confirmKickMember.memberId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 
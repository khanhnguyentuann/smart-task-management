"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Search, Plus, Users, CheckSquare, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { CreateProjectForm } from "@/features/projects/components/CreateProjectForm"
import { DeleteProjectDialog } from "@/features/projects/components/DeleteProjectDialog"
import { EditProjectForm } from "@/features/projects/components/EditProjectForm"
import { useProjects } from "@/features/projects/hooks/useProjects"
import { useToast } from "@/shared/components/ui/use-toast"
import type { ProjectsListProps } from "@/features/projects/types"
import { PROJECTS_CONSTANTS } from "../constants"
import { validateSearchQuery } from "../validation"
import { filterProjectsByQuery, formatProjectError } from "../utils"

export function ProjectsList({ user, onProjectSelect }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<any>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { projects, allProjects, loading, error, createProject, deleteProject, updateProject, searchProjects } = useProjects()
  const { toast } = useToast()

  // Store timeout reference
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (query.length >= PROJECTS_CONSTANTS.LIMITS.SEARCH_MIN_LENGTH) {
      // Validate search query
      const validation = validateSearchQuery(query)
      if (!validation.success) {
        console.error('Search validation failed:', validation.error)
        return
      }

      timeoutRef.current = setTimeout(() => {
        setIsSearching(true)
        searchProjects(query).finally(() => setIsSearching(false))
      }, PROJECTS_CONSTANTS.LIMITS.SEARCH_DEBOUNCE_MS)
    }
    // Khi query ngắn (< min), chỉ filter client-side theo allProjects
  }

  // Client-side filter for short queries only
  const filteredProjects = searchQuery.length < PROJECTS_CONSTANTS.LIMITS.SEARCH_MIN_LENGTH
    ? filterProjectsByQuery(allProjects, searchQuery)
    : projects // For server-side search, use server result

  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject(projectData)
      setShowCreateForm(false)
      toast({
        title: PROJECTS_CONSTANTS.MESSAGES.CREATE_SUCCESS,
        description: `Project "${projectData.name}" has been created.`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: PROJECTS_CONSTANTS.MESSAGES.CREATE_FAILED,
        description: formatProjectError(error),
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName })
    setShowDeleteDialog(true)
  }

  const handleEditProject = (project: any) => {
    setProjectToEdit(project)
    setShowEditForm(true)
  }

  const handleUpdateProject = async (projectData: any) => {
    if (!projectToEdit) return

    try {
      setEditLoading(true)
      await updateProject(projectToEdit.id, projectData)
      setShowEditForm(false)
      setProjectToEdit(null)
      toast({
        title: PROJECTS_CONSTANTS.MESSAGES.UPDATE_SUCCESS,
        description: `Project "${projectData.name}" has been updated.`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: PROJECTS_CONSTANTS.MESSAGES.UPDATE_FAILED,
        description: formatProjectError(error),
        variant: "destructive",
      })
    } finally {
      setEditLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setShowEditForm(false)
    setProjectToEdit(null)
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return

    try {
      setDeleteLoading(true)
      await deleteProject(projectToDelete.id)
      setShowDeleteDialog(false)
      setProjectToDelete(null)
      toast({
        title: PROJECTS_CONSTANTS.MESSAGES.DELETE_SUCCESS,
        description: `Project "${projectToDelete.name}" has been permanently deleted.`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: PROJECTS_CONSTANTS.MESSAGES.DELETE_FAILED,
        description: formatProjectError(error),
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
    setProjectToDelete(null)
  }

  if (showCreateForm) {
    return (
      <CreateProjectForm
        onBack={() => setShowCreateForm(false)}
        onSave={handleCreateProject}
        currentUser={user}
      />
    )
  }

  if (showEditForm && projectToEdit) {
    return (
      <EditProjectForm
        project={projectToEdit}
        onBack={handleCancelEdit}
        onSave={handleUpdateProject}
        loading={editLoading}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Projects</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading projects...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Projects</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading projects: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Projects</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${project.color}`} />
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={project.userRole === PROJECTS_CONSTANTS.ROLES.OWNER ? "default" : "secondary"} className="mt-1">
                          {project.userRole}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onProjectSelect(project.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {project.userRole === PROJECTS_CONSTANTS.ROLES.OWNER && (
                          <>
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProject(project.id, project.name)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {project.memberCount} members
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CheckSquare className="h-4 w-4" />
                      {project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done} tasks
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>
                        {project.taskStats.done}/{project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(project.taskStats.done / (project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">To Do: {project.taskStats.todo}</span>
                      <span className="text-blue-600">In Progress: {project.taskStats.inProgress}</span>
                      <span className="text-green-600">Done: {project.taskStats.done}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => onProjectSelect(project.id)}
                  >
                    View Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? "No projects found matching your search." : "No projects yet."}
              </div>
              {!searchQuery && (
                <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <DeleteProjectDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        projectName={projectToDelete?.name || ""}
      />
    </div>
  )
} 
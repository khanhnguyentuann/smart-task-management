"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Search, Plus, Users, CheckSquare, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { CreateProjectForm } from "@/features/projects/components/CreateProjectForm"
import { DeleteProjectDialog } from "@/features/projects/components/DeleteProjectDialog"
import { useProjects } from "@/features/projects/hooks/useProjects"
import { useToast } from "@/shared/components/ui/use-toast"
import type { ProjectsListProps } from "@/features/projects/types"

export function ProjectsList({ user, onProjectSelect }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { projects, loading, error, createProject, deleteProject } = useProjects()
  const { toast } = useToast()

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject(projectData)
      setShowCreateForm(false)
      toast({
        title: "Project created successfully!",
        description: `Project "${projectData.name}" has been created.`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName })
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return

    try {
      setDeleteLoading(true)
      await deleteProject(projectToDelete.id)
      setShowDeleteDialog(false)
      setProjectToDelete(null)
      toast({
        title: "Project deleted successfully!",
        description: `Project "${projectToDelete.name}" has been permanently deleted.`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Failed to delete project",
        description: error.message,
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
                        <Badge variant={project.userRole === "Owner" ? "default" : "secondary"} className="mt-1">
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
                        {project.userRole === "Owner" && (
                          <>
                            <DropdownMenuItem>
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
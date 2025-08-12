"use client"

import { useState, useRef } from "react"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Plus, Loader2 } from 'lucide-react'
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { CreateProjectModal } from "../Modals/CreateProjectModal"
import { EditProjectModal } from "../Modals/EditProjectModal"
import { DeleteProjectConfirm } from "../Modals/DeleteProjectConfirm"
import { ProjectCard } from "./ProjectCard"
import { ProjectSearch } from "./ProjectSearch"
import { EmptyState } from "./EmptyState"
import { useProjects } from "@/features/projects/hooks/useProjects"
import { useToast } from "@/shared/hooks/useToast"
import { useErrorHandler } from "@/shared/hooks"
import type { ProjectsListProps } from "@/features/projects/lib"
import { PROJECTS_CONSTANTS, validateSearchQuery, filterProjectsByQuery, formatProjectError } from "../../lib"

export function ProjectsList({ user, onProjectSelect }: ProjectsListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
    const [projectToEdit, setProjectToEdit] = useState<any>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const { projects, allProjects, loading, error, createProject, deleteProject, updateProject, searchProjects } = useProjects()
    const { toast } = useToast()
    const { handleError } = useErrorHandler({
        context: { component: 'ProjectsList' }
    })

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
                handleError(new Error(validation.error.errors[0]?.message || 'Invalid search query'))
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
            setShowCreateModal(false)
            toast({
                title: PROJECTS_CONSTANTS.MESSAGES.CREATE_SUCCESS,
                description: `Project "${projectData.name}" has been created.`,
                variant: "default",
            })
        } catch (error: any) {
            handleError(error)
        }
    }

    const handleDeleteProject = async (projectId: string, projectName: string) => {
        setProjectToDelete({ id: projectId, name: projectName })
        setShowDeleteDialog(true)
    }

    const handleEditProject = (project: any) => {
        setProjectToEdit(project)
        setShowEditModal(true)
    }

    const handleUpdateProject = async (projectData: any) => {
        if (!projectToEdit) return

        try {
            setEditLoading(true)
            await updateProject(projectToEdit.id, projectData)
            setShowEditModal(false)
            setProjectToEdit(null)
            toast({
                title: PROJECTS_CONSTANTS.MESSAGES.UPDATE_SUCCESS,
                description: `Project "${projectData.name}" has been updated.`,
                variant: "default",
            })
        } catch (error: any) {
            handleError(error)
        } finally {
            setEditLoading(false)
            setShowEditModal(false)
            setProjectToEdit(null)
        }
    }

    const handleCancelEdit = () => {
        setShowEditModal(false)
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
            handleError(error)
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteDialog(false)
        setProjectToDelete(null)
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
                        <ProjectSearch
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                            isSearching={isSearching}
                        />
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Project
                        </Button>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onView={onProjectSelect}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                            />
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <EmptyState
                            searchQuery={searchQuery}
                            onCreateProject={() => setShowCreateModal(true)}
                        />
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            <CreateProjectModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                currentUser={user}
                onCreated={handleCreateProject}
            />

            {/* Edit Project Modal */}
            <EditProjectModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                currentUser={user}
                project={projectToEdit}
                onUpdated={handleUpdateProject}
            />

            {/* Delete Project Dialog */}
            <DeleteProjectConfirm
                isOpen={showDeleteDialog}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                projectName={projectToDelete?.name || ""}
            />
        </div>
    )
}

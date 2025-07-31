"use client"

import { useCallback, useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CreateProjectModal } from "@/components/projects/create-project-modal"
import { ProjectCard } from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { projectService } from "@/services/project.service"
import { Project } from "@/types/project"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, FolderOpen, Grid3X3, List } from "lucide-react"

export default function ProjectsPage() {
    const { toast } = useToast()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showCreateModal, setShowCreateModal] = useState(false)

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true)
            const data = await projectService.getAll()
            setProjects(data)
        } catch {
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách project",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (query.trim()) {
            try {
                const data = await projectService.search(query)
                setProjects(data)
            } catch {
                toast({
                    title: "Lỗi",
                    description: "Không thể tìm kiếm project",
                    variant: "destructive",
                })
            }
        } else {
            fetchProjects()
        }
    }

    const handleDelete = async (project: Project) => {
        if (!confirm(`Bạn có chắc muốn xóa project "${project.name}"?`)) {
            return
        }

        try {
            await projectService.delete(project.id)
            toast({
                title: "Thành công",
                description: "Đã xóa project",
            })
            fetchProjects()
        } catch {
            toast({
                title: "Lỗi",
                description: "Không thể xóa project",
                variant: "destructive",
            })
        }
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                            <p className="text-muted-foreground">
                                Quản lý các dự án của bạn
                            </p>
                        </div>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo project
                        </Button>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm project..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Projects List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Chưa có project nào</h3>
                            <p className="mt-2 text-muted-foreground">
                                Bắt đầu bằng cách tạo project đầu tiên của bạn
                            </p>
                            <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo project đầu tiên
                            </Button>
                        </div>
                    ) : (
                        <div className={
                            viewMode === "grid"
                                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                                : "space-y-4"
                        }>
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <CreateProjectModal
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                    onSuccess={fetchProjects}
                />
            </DashboardLayout>
        </ProtectedRoute>
    )
}
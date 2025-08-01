"use client"

import { useCallback, useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import { projectService } from "@/services/project.service"
import { Project } from "@/types/project"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, FolderOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true)
            const data = await projectService.getAll()
            if (Array.isArray(data)) {
                setProjects(data)
            } else {
                console.error('Invalid projects data:', data)
                setProjects([])
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách project",
                variant: "destructive",
            })
            setProjects([])
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

    const handleView = (project: Project) => {
        router.push(`/projects/${project.id}`)
    }

    const filteredProjects = projects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto p-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                                <p className="text-muted-foreground">
                                    Quản lý và theo dõi các dự án của bạn
                                </p>
                            </div>

                            {/* Search and Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm projects..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button onClick={() => setShowCreateModal(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tạo Project Mới
                                </Button>
                            </div>

                            {/* Projects Grid */}
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center justify-center py-12"
                                    >
                                        <Spinner size="lg" />
                                    </motion.div>
                                ) : filteredProjects.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-12"
                                    >
                                        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            {searchQuery ? "Không tìm thấy project nào" : "Chưa có project nào"}
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            {searchQuery
                                                ? "Thử tìm kiếm với từ khóa khác"
                                                : "Bắt đầu bằng cách tạo project đầu tiên của bạn"
                                            }
                                        </p>
                                        {!searchQuery && (
                                            <Button onClick={() => setShowCreateModal(true)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tạo Project Đầu Tiên
                                            </Button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                                    >
                                        {filteredProjects.map((project, index) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                index={index}
                                                onDelete={handleDelete}
                                                onView={handleView}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
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
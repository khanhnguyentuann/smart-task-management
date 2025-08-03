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
import { getErrorMessage, isApiError } from "@/types/api"
import { ROUTES } from "@/constants/routes"
import { useToast } from '@/contexts/ToastContext';
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
            const errorMessage = getErrorMessage(error)

            if (isApiError(error)) {
                const statusCode = error.response?.status

                switch (statusCode) {
                    case 401:
                        toast({
                            title: "Phiên đăng nhập hết hạn",
                            description: "Vui lòng đăng nhập lại",
                            variant: "destructive",
                        })
                        router.push(ROUTES.LOGIN)
                        return

                    case 403:
                        toast({
                            title: "Không có quyền truy cập",
                            description: "Bạn không có quyền xem danh sách project",
                            variant: "destructive",
                        })
                        return

                    case 404:
                        toast({
                            title: "Không tìm thấy",
                            description: "API endpoint không tồn tại",
                            variant: "destructive",
                        })
                        return

                    case 500:
                        toast({
                            title: "Lỗi máy chủ",
                            description: "Máy chủ đang gặp sự cố, vui lòng thử lại sau",
                            variant: "destructive",
                        })
                        return
                }
            }

            // Generic error message
            toast({
                title: "Lỗi",
                description: errorMessage || "Không thể tải danh sách project",
                variant: "destructive",
            })
            setProjects([])
        } finally {
            setLoading(false)
        }
    }, [toast, router])

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (query.trim()) {
            try {
                const data = await projectService.search(query)
                setProjects(data)
            } catch (error) {
                const errorMessage = getErrorMessage(error)

                toast({
                    title: "Lỗi tìm kiếm",
                    description: errorMessage || "Không thể tìm kiếm project",
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
        } catch (error) {
            const errorMessage = getErrorMessage(error)

            if (isApiError(error)) {
                const statusCode = error.response?.status

                switch (statusCode) {
                    case 403:
                        toast({
                            title: "Không có quyền",
                            description: "Bạn không có quyền xóa project này",
                            variant: "destructive",
                        })
                        return

                    case 404:
                        toast({
                            title: "Không tìm thấy",
                            description: "Project không tồn tại hoặc đã bị xóa",
                            variant: "destructive",
                        })
                        // Refresh list to remove deleted item
                        fetchProjects()
                        return

                    case 409:
                        toast({
                            title: "Không thể xóa",
                            description: "Project có tasks đang hoạt động, không thể xóa",
                            variant: "destructive",
                        })
                        return
                }
            }

            toast({
                title: "Lỗi",
                description: errorMessage || "Không thể xóa project",
                variant: "destructive",
            })
        }
    }

    const handleView = (project: Project) => {
        router.push(ROUTES.PROJECT_DETAIL(project.id))
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
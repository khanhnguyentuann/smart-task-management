"use client"

import { useCallback, useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import { projectService } from "@/services/project.service"
import { Project } from "@/types/project"
import { getErrorMessage, isApiError } from "@/types/api"
import { ROUTES } from "@/constants/routes"
import { useToast } from '@/contexts/ToastContext';
import { Plus, Search, FolderOpen, Users, CheckSquare, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { GlassmorphismCard } from "@/components/ui/GlassmorphismCard"
import { EnhancedButton } from "@/components/ui/EnhancedButton"

export default function ProjectsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const { user } = useAuth()
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
        let isMounted = true;

        const loadProjects = async () => {
            if (isMounted) {
                await fetchProjects();
            }
        };

        loadProjects();

        // Cleanup function to prevent memory leaks
        return () => {
            isMounted = false;
        };
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

    // Helper function to get project color based on ID
    const getProjectColor = (id: string) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-teal-500",
            "bg-red-500"
        ]
        return colors[parseInt(id) % colors.length]
    }

    // Helper function to get project progress (mock data for now)
    const getProjectProgress = (project: Project) => {
        // This would come from your actual task data
        const totalTasks = project._count?.projectUsers || 0
        const completedTasks = Math.floor(totalTasks * 0.6) // Mock 60% completion
        const inProgressTasks = Math.floor(totalTasks * 0.2) // Mock 20% in progress
        const todoTasks = totalTasks - completedTasks - inProgressTasks

        return {
            todo: Math.max(0, todoTasks),
            inProgress: Math.max(0, inProgressTasks),
            done: Math.max(0, completedTasks),
            total: totalTasks,
            percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        }
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Floating Background Shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute opacity-5 dark:opacity-10"
                                initial={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                                }}
                                animate={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 25 + Math.random() * 15,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            >
                                <div
                                    className={`w-${12 + Math.floor(Math.random() * 20)} h-${12 + Math.floor(Math.random() * 20)} 
                                        ${Math.random() > 0.5 ? "rounded-full" : "rounded-lg"} 
                                        bg-gradient-to-br from-green-400 to-blue-400`}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto p-6 relative z-10">
                        <div className="space-y-6">
                            {/* Search and Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex flex-col sm:flex-row gap-4 justify-between"
                            >
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm projects..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <EnhancedButton
                                        onClick={() => setShowCreateModal(true)}
                                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg"
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                        </motion.div>
                                        Tạo Project Mới
                                    </EnhancedButton>
                                </motion.div>
                            </motion.div>

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
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                            className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
                                        >
                                            <FolderOpen className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                            {searchQuery ? "Không tìm thấy project nào" : "Chưa có project nào"}
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            {searchQuery
                                                ? "Thử tìm kiếm với từ khóa khác"
                                                : "Bắt đầu bằng cách tạo project đầu tiên của bạn"
                                            }
                                        </p>
                                        {!searchQuery && (
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <EnhancedButton
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Tạo Project Đầu Tiên
                                                </EnhancedButton>
                                            </motion.div>
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
                                        {filteredProjects.map((project, index) => {
                                            const progress = getProjectProgress(project)
                                            const projectColor = getProjectColor(project.id)

                                            return (
                                                <motion.div
                                                    key={project.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                                    whileHover={{ y: -5, scale: 1.02 }}
                                                    className="group"
                                                >
                                                    <GlassmorphismCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                                                        {/* Gradient Background */}
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${projectColor.replace('bg-', 'from-')} to-blue-500 opacity-5 group-hover:opacity-10 transition-opacity`} />

                                                        <CardHeader className="pb-3 relative z-10">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.2, rotate: 180 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className={`w-3 h-3 rounded-full ${projectColor} shadow-lg`}
                                                                    />
                                                                    <div>
                                                                        <CardTitle className="text-lg bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                                                            {project.name}
                                                                        </CardTitle>
                                                                        <Badge
                                                                            variant="default"
                                                                            className="mt-1"
                                                                        >
                                                                            {user?.role || 'Member'}
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
                                                                        <DropdownMenuItem onClick={() => handleView(project)}>
                                                                            <Eye className="h-4 w-4 mr-2" />
                                                                            Xem
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Chỉnh sửa
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="text-red-600"
                                                                            onClick={() => handleDelete(project)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Xóa
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4 relative z-10">
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {project.description || "Không có mô tả"}
                                                            </p>

                                                            <div className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Users className="h-4 w-4" />
                                                                    {project._count?.projectUsers || 0} thành viên
                                                                </div>
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <CheckSquare className="h-4 w-4" />
                                                                    {progress.total} tasks
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                                    <span>Tiến độ</span>
                                                                    <span>
                                                                        {progress.done}/{progress.total}
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-muted rounded-full h-2">
                                                                    <motion.div
                                                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${progress.percentage}%` }}
                                                                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-gray-500">To Do: {progress.todo}</span>
                                                                    <span className="text-blue-600">In Progress: {progress.inProgress}</span>
                                                                    <span className="text-green-600">Done: {progress.done}</span>
                                                                </div>
                                                            </div>

                                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                                <EnhancedButton
                                                                    variant="outline"
                                                                    className="w-full bg-transparent border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-950/20"
                                                                    onClick={() => handleView(project)}
                                                                >
                                                                    <motion.div
                                                                        animate={{ scale: [1, 1.1, 1] }}
                                                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-2 text-green-600" />
                                                                    </motion.div>
                                                                    Xem Project
                                                                </EnhancedButton>
                                                            </motion.div>
                                                        </CardContent>
                                                    </GlassmorphismCard>
                                                </motion.div>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
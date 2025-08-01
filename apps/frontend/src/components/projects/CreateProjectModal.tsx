"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from '@/contexts/ToastContext'
import { projectService } from "@/services/project.service"
import { createProjectSchema, CreateProjectFormData } from "@/schemas/project.schema"
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages"
import { ROUTES } from "@/constants/routes"
import { getErrorMessage } from "@/types/api"
import { Loader2, FolderPlus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface CreateProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function CreateProjectModal({ open, onOpenChange, onSuccess }: CreateProjectModalProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
    })

    const onSubmit = async (data: CreateProjectFormData) => {
        setIsSubmitting(true)
        try {
            const project = await projectService.create(data)

            toast({
                title: SUCCESS_MESSAGES.PROJECT_CREATED,
                description: `Project "${project.name}" đã được tạo`,
                variant: "success",
            })

            reset()
            onOpenChange(false)

            if (onSuccess) {
                onSuccess()
            } else {
                router.push(ROUTES.PROJECT_DETAIL(project.id))
            }
        } catch (error: unknown) {
            toast({
                title: "Lỗi",
                description: getErrorMessage(error) || ERROR_MESSAGES.PROJECT_CREATE_FAILED,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <FolderPlus className="h-5 w-5 text-primary" />
                            </motion.div>
                            Tạo Project Mới
                        </DialogTitle>
                        <DialogDescription>
                            Tạo một project mới để quản lý công việc của team
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="name">Tên project</Label>
                            <Input
                                id="name"
                                placeholder="VD: Website thương mại điện tử"
                                {...register("name")}
                                error={!!errors.name}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name.message}</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả ngắn về project..."
                                rows={3}
                                {...register("description")}
                                error={!!errors.description}
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">{errors.description.message}</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md"
                        >
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                AI sẽ tự động tóm tắt các task trong project này
                            </p>
                        </motion.div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tạo project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
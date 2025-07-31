"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { projectService } from "@/services/project.service"
import { Loader2, FolderPlus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const createProjectSchema = z.object({
    name: z.string().min(3, "Tên project phải có ít nhất 3 ký tự").max(100),
    description: z.string().max(500).optional(),
})

type CreateProjectForm = z.infer<typeof createProjectSchema>

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
    } = useForm<CreateProjectForm>({
        resolver: zodResolver(createProjectSchema),
    })

    const onSubmit = async (data: CreateProjectForm) => {
        setIsSubmitting(true)
        try {
            const project = await projectService.create(data)

            toast({
                title: "Tạo project thành công! 🎉",
                description: `Project "${project.name}" đã được tạo`,
            })

            reset()
            onOpenChange(false)

            if (onSuccess) {
                onSuccess()
            } else {
                router.push(`/projects/${project.id}`)
            }
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error.response?.data?.message || "Không thể tạo project",
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
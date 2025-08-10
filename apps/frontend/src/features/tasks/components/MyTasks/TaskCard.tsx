"use client"

import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Calendar } from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/shared/lib/utils/cn"
import { AnimatedTaskCardProps } from "../../types/task.types"
import { getPriorityColor } from "@/features/projects"

export function TaskCard({ task, className, onClick }: AnimatedTaskCardProps) {
    const getPriorityAnimation = (priority: string) => {
        switch (priority) {
            case "High":
                return "animate-pulse-subtle" // Subtle pulse effect 🔥
            case "Medium":
                return "animate-glow-gentle" // Gentle glow animation ⚡
            case "Low":
                return "animate-breathe" // Soft breathing animation 🌱
            default:
                return ""
        }
    }

    const getDeadlineStatus = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { color: "text-red-600", label: "Overdue" }
        if (diffDays === 0) return { color: "text-yellow-600", label: "Due today" }
        if (diffDays <= 3) return { color: "text-yellow-600", label: `Due in ${diffDays} days` }
        return { color: "text-muted-foreground", label: `Due in ${diffDays} days` }
    }

    const deadlineStatus = getDeadlineStatus((task as any).dueDate || task.deadline)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                getPriorityAnimation(task.priority),
                task.status === "DONE" && "animate-sparkle", // Sparkle animation for completed tasks ✨
                className,
            )}
            onClick={onClick}
        >
            <GlassmorphismCard className="group cursor-pointer">
                <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <h4 className="font-medium group-hover:text-blue-600 transition-colors">{task.title}</h4>
                        <div className="flex items-center gap-2">
                            <motion.div
                                className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            />
                            <Badge variant="outline" className="text-xs">
                                {task.priority}
                            </Badge>
                        </div>
                    </div>

                    {/* AI Summary with kawaii robot */}
                    <motion.div
                        className="flex items-start gap-2 p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-md backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            }}
                        >
                            <div className="text-blue-600 text-sm">🤖✨</div>
                        </motion.div>
                        <p className="text-sm text-blue-800 dark:text-blue-200">{task.aiSummary}</p>
                    </motion.div>

                    <div className="flex items-center justify-between">
                        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                            <Avatar className="h-6 w-6 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                                <AvatarImage src={task.assignee?.avatar && task.assignee.avatar.startsWith('data:image') ? task.assignee.avatar : (task.assignee?.avatar || '/default-avatar.svg')} alt={task.assignee.name} />
                                <AvatarFallback className="text-xs">
                                    {task.assignee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                        </motion.div>

                        <motion.div
                            className={`text-xs flex items-center gap-1 ${deadlineStatus.color}`}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Calendar className="h-3 w-3" />
                            {deadlineStatus.label}
                        </motion.div>
                    </div>

                    {/* Completed task celebration */}
                    {task.status === "DONE" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 text-2xl">
                            ✨
                        </motion.div>
                    )}
                </div>
            </GlassmorphismCard>
        </motion.div>
    )
}

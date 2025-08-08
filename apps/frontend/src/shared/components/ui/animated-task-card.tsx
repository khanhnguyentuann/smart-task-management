"use client"

import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface Task {
  id: string
  title: string
  aiSummary: string
  priority: "Low" | "Medium" | "High"
  status: "todo" | "inProgress" | "done"
  project: string
  deadline: string
  assignee: {
    name: string
    avatar: string
  }
}

interface AnimatedTaskCardProps {
  task: Task
  className?: string
}

export function AnimatedTaskCard({ task, className }: AnimatedTaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
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

  const deadlineStatus = getDeadlineStatus(task.deadline)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <GlassmorphismCard className="hover:shadow-lg transition-all duration-300">
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
              <Badge variant="outline" className="text-xs">
                {task.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
            <div className="w-1 h-full bg-blue-600 rounded-full flex-shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{task.aiSummary}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className={`text-xs ${deadlineStatus.color}`}>{deadlineStatus.label}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{task.project}</span>
            <Badge
              variant={task.status === "done" ? "default" : "secondary"}
              className="text-xs capitalize"
            >
              {task.status}
            </Badge>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  )
} 
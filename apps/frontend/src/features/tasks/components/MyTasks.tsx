"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { CheckSquare, Plus, Filter, Calendar, User } from "lucide-react"
import { motion } from "framer-motion"
import { MyTasksProps, Task } from "../types/task.types"
import { formatDate, isOverdue } from "@/core/utils/date.utils"

export function MyTasks({ tasks, onTaskClick, onCreateTask, onUpdateTask }: MyTasksProps) {
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "completed">("all")

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true
    return task.status === filter
  })

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    onUpdateTask(taskId, { status: newStatus })
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            <h1 className="text-xl font-semibold">My Tasks</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "todo", "in-progress", "completed"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${
                    isOverdue(task.dueDate) && task.status !== "completed" 
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20" 
                      : ""
                  }`}
                  onClick={() => onTaskClick(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === "in-progress" ? "In Progress" : task.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className={isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-600" : ""}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
                          <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        {task.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(task.id, "completed")
                            }}
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
              <p className="mt-2 text-muted-foreground">
                {filter === "all" 
                  ? "Get started by creating your first task."
                  : `No ${filter} tasks found.`
                }
              </p>
              {filter === "all" && (
                <Button onClick={onCreateTask} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
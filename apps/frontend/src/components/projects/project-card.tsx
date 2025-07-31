"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Project } from "@/types/project"
import { MoreHorizontal, Edit, Trash2, Eye, Users, CheckSquare } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectCardProps {
    project: Project
    index?: number
    onEdit?: (project: Project) => void
    onDelete?: (project: Project) => void
    onView?: (project: Project) => void
}

const projectColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
]

export function ProjectCard({ project, index = 0, onEdit, onDelete, onView }: ProjectCardProps) {
    const isOwner = true // TODO: Check if current user is owner
    const color = projectColors[index % projectColors.length]

    // Mock data for demo
    const tasks = {
        todo: 8,
        inProgress: 3,
        done: 12,
    }
    const totalTasks = tasks.todo + tasks.inProgress + tasks.done
    const progress = totalTasks > 0 ? (tasks.done / totalTasks) * 100 : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg line-clamp-1">
                                    {project.name}
                                </h3>
                                <Badge
                                    variant={isOwner ? "default" : "secondary"}
                                    className="mt-1"
                                >
                                    {isOwner ? "Admin" : "Member"}
                                </Badge>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onView?.(project)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </DropdownMenuItem>
                                {isOwner && (
                                    <>
                                        <DropdownMenuItem onClick={() => onEdit?.(project)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => onDelete?.(project)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {project._count?.projectUsers || 1} members
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <CheckSquare className="h-4 w-4" />
                            {totalTasks} tasks
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{tasks.done}/{totalTasks}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="bg-blue-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                            />
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">To Do: {tasks.todo}</span>
                            <span className="text-blue-600">In Progress: {tasks.inProgress}</span>
                            <span className="text-green-600">Done: {tasks.done}</span>
                        </div>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                        <Button
                            variant="outline"
                            className="w-full bg-transparent hover:bg-accent"
                        >
                            View Project
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    )
}
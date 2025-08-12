"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Users, CheckSquare, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { PROJECTS_CONSTANTS } from "../../lib"

interface ProjectCardProps {
    project: any
    onView: (projectId: string) => void
    onEdit: (project: any) => void
    onDelete: (projectId: string, projectName: string) => void
}

export const ProjectCard = React.memo(function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${project.color}`} />
                        <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <Badge variant={project.userRole === PROJECTS_CONSTANTS.ROLES.OWNER ? "default" : "secondary"} className="mt-1">
                                {project.userRole}
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
                            <DropdownMenuItem onClick={() => onView(project.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </DropdownMenuItem>
                            {project.userRole === PROJECTS_CONSTANTS.ROLES.OWNER && (
                                <>
                                    <DropdownMenuItem onClick={() => onEdit(project)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => onDelete(project.id, project.name)}
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
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {project.memberCount} members
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <CheckSquare className="h-4 w-4" />
                        {project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done} tasks
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                            {project.taskStats.done}/{project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done}
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        {(project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done) > 0 && (
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                    width: `${(project.taskStats.done / (project.taskStats.todo + project.taskStats.inProgress + project.taskStats.done)) * 100}%`,
                                }}
                            />
                        )}
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">To Do: {project.taskStats.todo}</span>
                        <span className="text-blue-600">In Progress: {project.taskStats.inProgress}</span>
                        <span className="text-green-600">Done: {project.taskStats.done}</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => onView(project.id)}
                >
                    View Project
                </Button>
            </CardContent>
        </Card>
    )
})

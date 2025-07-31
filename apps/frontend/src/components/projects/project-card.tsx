"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Project } from "@/types/project"
import { FolderOpen, Users, Calendar, MoreVertical, Edit, Trash2, UserPlus } from "lucide-react"

interface ProjectCardProps {
    project: Project
    onEdit?: (project: Project) => void
    onDelete?: (project: Project) => void
    onManageMembers?: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onDelete, onManageMembers }: ProjectCardProps) {
    const isOwner = true // TODO: Check if current user is owner

    return (
        <Card className="h-full hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <Link href={`/projects/${project.id}`}>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                                {project.name}
                            </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2">
                            {project.description || "Không có mô tả"}
                        </CardDescription>
                    </div>
                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit?.(project)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onManageMembers?.(project)}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Quản lý thành viên
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(project)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Xóa project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project._count?.projectUsers || 1} thành viên</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                                {project.owner.email.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <p className="font-medium">{project.owner.email}</p>
                            <p className="text-xs text-muted-foreground">Owner</p>
                        </div>
                    </div>
                    <Link href={`/projects/${project.id}`}>
                        <Button size="sm" variant="outline">
                            <FolderOpen className="mr-2 h-4 w-4" />
                            Mở
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
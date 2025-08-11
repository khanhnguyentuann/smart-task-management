"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Plus, Users } from "lucide-react"

interface ProjectHeaderProps {
    project: any
    onAddTask: () => void
    onAddMember: () => void
}

export function ProjectHeader({ project, onAddTask, onAddMember }: ProjectHeaderProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{project.name}</CardTitle>
                        <p className="text-muted-foreground mt-2">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {project.members?.slice(0, 3).map((m: any, index: number) => (
                                <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                    <AvatarImage
                                        src={m.user?.avatar && m.user.avatar.startsWith('data:image') ? m.user.avatar : (m.user?.avatar || '/default-avatar.svg')}
                                        alt={`${m.user?.firstName} ${m.user?.lastName}`}
                                    />
                                    <AvatarFallback>
                                        {(m.user?.firstName || "").charAt(0)}
                                        {(m.user?.lastName || "").charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {project.members && project.members.length > 3 && (
                                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                    +{project.members.length - 3}
                                </div>
                            )}
                        </div>
                        {project.ownerId === project.currentUserId && (
                            <div className="flex gap-2">
                                <Button onClick={onAddMember} variant="outline" size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Add Member
                                </Button>
                                <Button onClick={onAddTask}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Task
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

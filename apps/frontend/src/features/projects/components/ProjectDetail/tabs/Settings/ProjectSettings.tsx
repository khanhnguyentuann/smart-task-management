"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { AlertTriangle, Archive, Trash2 } from "lucide-react"
import { useUser } from "@/features/layout"
import { getProjectPermissions } from "@/shared/lib/permissions"

interface ProjectSettingsProps {
    project: any
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
    const { user } = useUser()
    const { canEditProject, canDeleteProject } = getProjectPermissions(project, user)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Project Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name:</span>
                                <span>{project.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Description:</span>
                                <span>{project.description || 'No description'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="capitalize">{project.status?.toLowerCase() || 'Active'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Team</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Members:</span>
                                <span>{project.members?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Owner:</span>
                                <span>
                                    {project.members?.find((m: any) => m.user?.id === project.ownerId)?.user?.firstName || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Tasks</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Tasks:</span>
                                <span>{project.tasks?.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone - Only for Project Owner */}
                    {canDeleteProject && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4 text-red-600 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Danger Zone
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-red-800 dark:text-red-200">Archive Project</h4>
                                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                                Archive this project to hide it from active projects. You can restore it later.
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-100">
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-red-800 dark:text-red-200">Delete Project</h4>
                                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                                Permanently delete this project and all its data. This action cannot be undone.
                                            </p>
                                        </div>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <p className="text-muted-foreground text-sm">
                            Additional project settings and configuration options will be available here in future updates.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

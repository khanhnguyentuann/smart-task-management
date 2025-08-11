"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

interface ProjectSettingsProps {
    project: any
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
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

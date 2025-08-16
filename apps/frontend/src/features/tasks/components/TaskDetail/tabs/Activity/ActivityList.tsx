"use client"

import { ActivityItem } from "./ActivityItem"
import { TaskDetail } from "../../../../types/task.types"
import { Activity, Edit, MessageSquare, UserPlus, Calendar, CheckCircle } from 'lucide-react'

interface ActivityListProps {
    activities?: TaskDetail['activities']
}

export function ActivityList({ activities }: ActivityListProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                            No activity yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Activity will appear here when you and your team take actions on this task.
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 max-w-md">
                        <h4 className="text-sm font-medium text-foreground mb-3">📊 What creates activity:</h4>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Edit className="h-3 w-3" />
                                <span>Task updates and edits</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                <span>Comments and discussions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-3 w-3" />
                                <span>Assignee changes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Due date modifications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3" />
                                <span>Status changes and completions</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-border/50">
                            <h5 className="text-xs font-medium text-foreground mb-2">💡 Get started:</h5>
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <div>• Edit the task details to see your first activity</div>
                                <div>• Add a comment to start the conversation</div>
                                <div>• Assign team members to track collaboration</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
        </div>
    )
}

"use client"

import { ActivityItem } from "./ActivityItem"
import { TaskDetail } from "../../../../types/task.types"

interface ActivityListProps {
    activities?: TaskDetail['activities']
}

export function ActivityList({ activities }: ActivityListProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">
                    No activity yet. Activity will appear here when actions are taken on this task.
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

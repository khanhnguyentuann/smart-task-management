"use client"

import { ActivityList } from "./ActivityList"
import { TaskDetail } from "../../../../types/task.types"

interface ActivityTabProps {
    currentTask: TaskDetail | null
}

export function ActivityTab({ currentTask }: ActivityTabProps) {
    return (
        <div className="space-y-4 mt-6">
            <ActivityList activities={currentTask?.activities} />
        </div>
    )
}

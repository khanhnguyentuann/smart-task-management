"use client"

import { useState } from "react"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { TaskDetail } from "../../../../types/task.types"

interface Activity {
    id: string
    type: "created" | "assigned" | "status" | "priority" | "due_date" | "edited" | "file" | "comment"
    description: string
    user: {
        id: string
        name: string
        avatar?: string
    }
    timestamp: Date
    details?: {
        from?: string
        to?: string
        fileName?: string
    }
}

interface ActivityTabProps {
    currentTask: TaskDetail | null
}

// Mock data for demonstration
const mockActivities: Activity[] = [
    {
        id: "1",
        type: "status",
        description: "marked task as Done",
        user: {
            id: "user3",
            name: "Carol Davis",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        details: { from: "In Progress", to: "Done" },
    },
    {
        id: "2",
        type: "due_date",
        description: "changed due date",
        user: {
            id: "user2",
            name: "Bob Smith",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        details: { from: "Aug 18", to: "Aug 20" },
    },
    {
        id: "3",
        type: "assigned",
        description: "assigned task to Bob Smith",
        user: {
            id: "user1",
            name: "Alice Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
        id: "4",
        type: "file",
        description: "uploaded file",
        user: {
            id: "user4",
            name: "Tuấn Khanh",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        details: { fileName: "spec.pdf" },
    },
    {
        id: "5",
        type: "created",
        description: "created this task",
        user: {
            id: "user1",
            name: "Alice Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
]

const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
        case "created":
            return "📌"
        case "assigned":
            return "👤"
        case "status":
            return "✅"
        case "priority":
            return "🔥"
        case "due_date":
            return "⏰"
        case "edited":
            return "📝"
        case "file":
            return "📎"
        case "comment":
            return "💬"
        default:
            return "📋"
    }
}

const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
    return date.toLocaleDateString()
}

export function ActivityTab({ currentTask }: ActivityTabProps) {
    const [filterType, setFilterType] = useState<string>("all")
    const activities = mockActivities // Use mock data for now

    const filteredActivities = activities.filter((activity) => {
        if (filterType === "all") return true
        return activity.type === filterType
    })

    return (
        <div className="space-y-6">
            {/* Filter */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-foreground">Activity Timeline</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterType("all")}>All Activities</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("status")}>Status Changes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("assigned")}>Assignments</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("file")}>Files</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("comment")}>Comments</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

                <div className="space-y-6">
                    {filteredActivities.map((activity, index) => (
                        <div key={activity.id} className="relative flex items-start space-x-4">
                            {/* Timeline dot */}
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full">
                                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                            </div>

                            {/* Activity content */}
                            <Card className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={activity.user.avatar || "/placeholder.svg"}
                                                alt={activity.user.name}
                                            />
                                            <AvatarFallback>
                                                {activity.user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm text-foreground">
                                                <span className="font-medium">{activity.user.name}</span> {activity.description}
                                                {activity.details?.fileName && (
                                                    <span className="font-medium"> {activity.details.fileName}</span>
                                                )}
                                            </p>
                                            {activity.details && (activity.details.from || activity.details.to) && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.details.from && activity.details.to && (
                                                        <>
                                                            from <span className="font-medium">{activity.details.from}</span> to{" "}
                                                            <span className="font-medium">{activity.details.to}</span>
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTimestamp(activity.timestamp)}</span>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {filteredActivities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No activities match your filter criteria</div>
                )}
            </div>
        </div>
    )
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { format } from "date-fns"
import { motion } from "framer-motion"

interface ActivityItemProps {
    activity: {
        id: string
        type: string
        description: string
        user: {
            id: string
            name: string
            avatar: string
        }
        timestamp: Date
    }
}

export function ActivityItem({ activity }: ActivityItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3"
        >
            <Avatar className="h-6 w-6">
                <AvatarImage
                    src={activity.user?.avatar && activity.user.avatar.startsWith('data:image')
                        ? activity.user.avatar
                        : (activity.user?.avatar || '/default-avatar.svg')}
                    alt={activity.user?.name || 'User'}
                />
                <AvatarFallback className="text-xs">
                    {(activity.user?.name || "U").split(" ").map((n: string) => n?.[0] || "").join("") || "U"}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.description}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                    {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
        </motion.div>
    )
}

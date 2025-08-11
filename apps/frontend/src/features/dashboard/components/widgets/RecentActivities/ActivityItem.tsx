"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Activity } from "../../../types/dashboard.types"
import { getStatusColor } from "../../../lib/utils"

interface ActivityItemProps {
    activity: Activity
    index: number
}

export function ActivityItem({ activity, index }: ActivityItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 group"
        >
            <div className="relative">
                <motion.div whileHover={{ scale: 1.1 }}>
                    <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800 shadow-lg">
                        <AvatarImage 
                            src={activity.avatar && activity.avatar.startsWith('data:image') ? activity.avatar : (activity.avatar || '/default-avatar.svg')} 
                            alt={activity.user} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                <motion.div
                    className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getStatusColor(activity.status)} shadow-lg`}
                    whileHover={{ scale: 1.2 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                    <activity.icon className="h-3 w-3" />
                </motion.div>
            </div>

            <div className="flex-1 space-y-1">
                <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {activity.target}
                    </span>
                </p>
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-1 h-1 bg-blue-500 rounded-full"
                    />
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
            </div>
        </motion.div>
    )
}

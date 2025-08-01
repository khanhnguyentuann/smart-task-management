"use client"

import { motion } from "framer-motion"
import { Stat, Achievement } from "@/data/features"

interface StatsSectionProps {
    stats: Stat[]
    delay?: number
}

export function StatsSection({ stats, delay = 1 }: StatsSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex justify-between p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20"
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay + 0.2 + index * 0.1 }}
                    className="text-center"
                >
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}

interface AchievementsSectionProps {
    achievements: Achievement[]
    delay?: number
}

export function AchievementsSection({ achievements, delay = 1.2 }: AchievementsSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex justify-between p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20"
        >
            {achievements.map((achievement, index) => (
                <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay + 0.2 + index * 0.1 }}
                    className="text-center"
                >
                    <div className="flex justify-center mb-1">
                        <achievement.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {achievement.number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {achievement.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}
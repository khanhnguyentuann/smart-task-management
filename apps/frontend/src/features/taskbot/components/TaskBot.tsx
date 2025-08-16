"use client"

import { motion } from "framer-motion"
import type { User } from "@/shared/lib/types"
import type { TaskBotMood } from "../types/taskbot.types"
import { TASKBOT_CONSTANTS } from "../constants/taskbot.constants"

interface TaskBotProps {
    mood: TaskBotMood
    currentPage: string
    user: User
    onCreateTask: () => void
    onNavigate: (page: string) => void
}

export function TaskBot({ mood, currentPage, user, onCreateTask, onNavigate }: TaskBotProps) {
    const getMoodEmoji = (moodType: TaskBotMood['type']) => {
        switch (moodType) {
            case 'happy':
                return TASKBOT_CONSTANTS.MOODS.HAPPY
            case 'working':
                return TASKBOT_CONSTANTS.MOODS.WORKING
            case 'thinking':
                return TASKBOT_CONSTANTS.MOODS.THINKING
            case 'sleeping':
                return TASKBOT_CONSTANTS.MOODS.SLEEPING
            default:
                return TASKBOT_CONSTANTS.MOODS.WORKING
        }
    }

    return (
        <motion.div
            className={`fixed ${TASKBOT_CONSTANTS.POSITION.MOBILE.BOTTOM} ${TASKBOT_CONSTANTS.POSITION.MOBILE.RIGHT} ${TASKBOT_CONSTANTS.POSITION.DESKTOP.BOTTOM} ${TASKBOT_CONSTANTS.POSITION.DESKTOP.RIGHT} z-50 block`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: TASKBOT_CONSTANTS.ANIMATION.DELAY, type: "spring" }}
        >
            <motion.div
                className="text-4xl cursor-pointer"
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: TASKBOT_CONSTANTS.ANIMATION.DURATION,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                style={{
                    animationPlayState: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'paused' : 'running'
                }}
                onClick={onCreateTask}
                title={mood.message || `TaskBot is ${mood.type}`}
            >
                {getMoodEmoji(mood.type)}
            </motion.div>
        </motion.div>
    )
}

"use client"

import { motion } from "framer-motion"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Plus } from "lucide-react"

interface TaskBotProps {
  mood: "happy" | "working"
  currentPage: string
  user: any
  onCreateTask: () => void
  onNavigate: (page: string) => void
}

export function TaskBot({ mood, currentPage, user, onCreateTask, onNavigate }: TaskBotProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <motion.div
        className="text-4xl cursor-pointer"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        onClick={onCreateTask}
      >
        🤖
      </motion.div>
    </motion.div>
  )
} 

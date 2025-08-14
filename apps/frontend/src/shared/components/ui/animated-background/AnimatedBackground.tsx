"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
    </div>
  )
} 

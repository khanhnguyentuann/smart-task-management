"use client"

import { motion } from "framer-motion"

interface LoadingAnimationProps {
  type?: "dots" | "spinner" | "sparkles"
  size?: "sm" | "md" | "lg"
  color?: "blue" | "purple" | "green" | "red"
}

export function LoadingAnimation({ type = "dots", size = "md", color = "blue" }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  const colorClasses = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    red: "bg-red-500",
  }

  if (type === "dots") {
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  if (type === "spinner") {
    return (
      <motion.div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-${color}-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    )
  }

  if (type === "sparkles") {
    return (
      <div className="flex items-center gap-1">
        {["✨", "⭐", "💫"].map((sparkle, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          >
            {sparkle}
          </motion.span>
        ))}
      </div>
    )
  }

  return null
} 

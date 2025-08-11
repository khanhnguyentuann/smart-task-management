"use client"

import type React from "react"

import { Card } from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils/cn"
import { motion } from "framer-motion"
import { forwardRef } from "react"

interface GlassmorphismCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
  className?: string
  withHover?: boolean
  intensity?: "light" | "medium" | "strong"
}

export const GlassmorphismCard = forwardRef<HTMLDivElement, GlassmorphismCardProps>(
  ({ children, className, withHover = true, intensity = "medium", ...props }, ref) => {
    const intensityClasses = {
      light: "backdrop-blur-sm bg-white/10 dark:bg-black/10",
      medium: "backdrop-blur-md bg-white/20 dark:bg-black/20",
      strong: "backdrop-blur-lg bg-white/30 dark:bg-black/30",
    }

    return (
      <motion.div
        whileHover={
          withHover
            ? {
                y: -4,
                rotateX: 2,
                rotateY: 2,
                scale: 1.02,
              }
            : {}
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="perspective-1000"
      >
        <Card
          ref={ref}
          className={cn(
            "border border-white/20 dark:border-white/10",
            "shadow-xl shadow-black/10 dark:shadow-black/30",
            intensityClasses[intensity],
            "transition-all duration-300",
            withHover && "hover:shadow-2xl hover:shadow-blue-500/10",
            className,
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    )
  },
)

GlassmorphismCard.displayName = "GlassmorphismCard" 

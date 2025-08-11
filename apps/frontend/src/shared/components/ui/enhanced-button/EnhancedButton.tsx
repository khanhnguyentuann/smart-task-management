"use client"

import type React from "react"

import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils/cn"
import { motion } from "framer-motion"
import { forwardRef } from "react"

interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  withRipple?: boolean
  withGlow?: boolean
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ children, className, withRipple = true, withGlow = true, ...props }, ref) => {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative inline-block">
        <Button
          ref={ref}
          className={cn(
            "rounded-full relative overflow-hidden transition-all duration-300",
            withGlow && "hover:shadow-lg hover:shadow-blue-500/25",
            "group",
            className,
          )}
          {...props}
        >
          <span className="relative z-10 flex items-center gap-2">{children}</span>

          {/* Ripple effect */}
          {withRipple && (
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 bg-white/20 scale-0 rounded-full group-active:scale-100 transition-transform duration-300 origin-center" />
            </span>
          )}

          {/* Glow effect */}
          {withGlow && (
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </Button>
      </motion.div>
    )
  },
)

EnhancedButton.displayName = "EnhancedButton" 

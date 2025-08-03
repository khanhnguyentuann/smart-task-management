"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AppLogoProps {
    /** Kích thước logo */
    size?: "sm" | "md" | "lg" | "xl"
    /** Có animation không */
    animated?: boolean
    /** Có shadow không */
    showShadow?: boolean
    /** Custom className */
    className?: string
    /** Variant của logo */
    variant?: "default" | "minimal" | "text" | "icon-only"
    /** Text hiển thị bên cạnh icon (cho variant text) */
    text?: string
    /** Click handler */
    onClick?: () => void
    /** Có clickable không */
    clickable?: boolean
}

const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-14 w-14",
}

const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
}

const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
}

export function AppLogo({
    size = "lg",
    animated = true,
    showShadow = true,
    className,
    variant = "default",
    text = "SmartTask",
    onClick,
    clickable = false,
}: AppLogoProps) {
    const logoClasses = cn(
        "rounded-full bg-gradient-to-br from-blue-600 via-purple-500 to-purple-600 flex items-center justify-center text-white",
        showShadow && "shadow-xl",
        clickable && "cursor-pointer hover:scale-105 transition-transform",
        sizeClasses[size],
        className
    )

    const iconClasses = cn(
        iconSizes[size]
    )

    const textClasses = cn(
        "font-bold font-mono tracking-tight",
        textSizes[size]
    )

    // Animation variants
    const logoAnimation = {
        animate: animated ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
        } : {},
        transition: animated ? {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse" as const
        } : {}
    }

    // Icon only variant
    if (variant === "icon-only") {
        return (
            <motion.div
                className={logoClasses}
                onClick={clickable ? onClick : undefined}
                {...logoAnimation}
            >
                <Sparkles className={iconClasses} />
            </motion.div>
        )
    }

    // Text variant
    if (variant === "text") {
        return (
            <motion.div
                className="flex items-center gap-3"
                onClick={clickable ? onClick : undefined}
                {...logoAnimation}
            >
                <div className={logoClasses}>
                    <Sparkles className={iconClasses} />
                </div>
                <span className={textClasses}>{text}</span>
            </motion.div>
        )
    }

    // Minimal variant (just icon with text, no background)
    if (variant === "minimal") {
        return (
            <motion.div
                className="flex items-center gap-2"
                onClick={clickable ? onClick : undefined}
                {...logoAnimation}
            >
                <Sparkles className={cn(iconClasses, "text-blue-600")} />
                <span className={cn(textClasses, "text-foreground")}>{text}</span>
            </motion.div>
        )
    }

    // Default variant (icon with background)
    return (
        <motion.div
            className={logoClasses}
            onClick={clickable ? onClick : undefined}
            {...logoAnimation}
        >
            <Sparkles className={iconClasses} />
        </motion.div>
    )
}

// Predefined variants for common use cases
export function AuthLogo({ ...props }: Omit<AppLogoProps, 'size' | 'animated' | 'showShadow'>) {
    return (
        <AppLogo
            size="xl"
            animated={true}
            showShadow={true}
            {...props}
        />
    )
}

export function NavbarLogo({ ...props }: Omit<AppLogoProps, 'size' | 'animated' | 'variant'>) {
    return (
        <AppLogo
            size="md"
            animated={false}
            variant="text"
            clickable={true}
            {...props}
        />
    )
}

export function FooterLogo({ ...props }: Omit<AppLogoProps, 'size' | 'animated' | 'variant'>) {
    return (
        <AppLogo
            size="sm"
            animated={false}
            variant="minimal"
            {...props}
        />
    )
}

export function FaviconLogo({ ...props }: Omit<AppLogoProps, 'size' | 'animated' | 'showShadow'>) {
    return (
        <AppLogo
            size="sm"
            animated={false}
            showShadow={false}
            {...props}
        />
    )
} 
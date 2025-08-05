"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useMemo } from "react"

export function AnimatedBackground() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        
        // Cleanup function to prevent memory leaks
        return () => {
            setMounted(false)
        }
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
            {theme === "dark" ? <DarkBackground /> : <LightBackground />}
        </div>
    )
}

function LightBackground() {
    // Memoize random values to prevent recalculation on every render
    const elements = useMemo(() => {
        return Array.from({ length: 4 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${i * 0.5}s`,
            duration: `${4 + Math.random() * 2}s`,
            size: 4 + Math.floor(Math.random() * 4),
            isCircle: Math.random() > 0.5
        }))
    }, [])

    const particles = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${i * 0.2}s`,
            duration: `${8 + Math.random() * 4}s`,
        }))
    }, [])

    return (
        <>
            <div className="absolute inset-0">
                {elements.map((element) => (
                    <div
                        key={element.id}
                        className="absolute animate-float opacity-10"
                        style={{
                            left: element.left,
                            top: element.top,
                            animationDelay: element.delay,
                            animationDuration: element.duration,
                        }}
                    >
                        <div
                            className={`w-${element.size} h-${element.size} 
                                ${element.isCircle ? "rounded-full" : "rounded-lg"} 
                                bg-gradient-to-br from-blue-400 to-purple-400`}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute inset-0">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-blue-300 rounded-full animate-particle opacity-20"
                        style={{
                            left: particle.left,
                            top: particle.top,
                            animationDelay: particle.delay,
                            animationDuration: particle.duration,
                        }}
                    />
                ))}
            </div>
        </>
    )
}

function DarkBackground() {
    // Memoize random values to prevent recalculation on every render
    const stars = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${i * 0.1}s`,
            duration: `${2 + Math.random() * 2}s`,
        }))
    }, [])

    const orbs = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${i * 0.8}s`,
            duration: `${6 + Math.random() * 3}s`,
        }))
    }, [])

    return (
        <>
            <div className="absolute inset-0">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0">
                {orbs.map((orb) => (
                    <div
                        key={orb.id}
                        className="absolute animate-float-slow opacity-20"
                        style={{
                            left: orb.left,
                            top: orb.top,
                            animationDelay: orb.delay,
                            animationDuration: orb.duration,
                        }}
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-lg" />
                    </div>
                ))}
            </div>
        </>
    )
}
"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {theme === "dark" ? <DarkBackground /> : <LightBackground />}
        </div>
    )
}

function LightBackground() {
    return (
        <>
            <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${4 + Math.random() * 2}s`,
                        }}
                    >
                        <div
                            className={`w-${4 + Math.floor(Math.random() * 8)} h-${4 + Math.floor(Math.random() * 8)} 
                                ${Math.random() > 0.5 ? "rounded-full" : "rounded-lg"} 
                                bg-gradient-to-br from-blue-400 to-purple-400`}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-300 rounded-full animate-particle opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: `${8 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>
        </>
    )
}

function DarkBackground() {
    return (
        <>
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-slow opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: `${6 + Math.random() * 3}s`,
                        }}
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-xl" />
                    </div>
                ))}
            </div>
        </>
    )
}
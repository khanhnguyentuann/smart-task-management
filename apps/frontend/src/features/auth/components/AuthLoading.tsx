"use client"

import { motion } from "framer-motion"
import { Sparkles, Loader2 } from "lucide-react"

interface AuthLoadingProps {
    message?: string
}

export function AuthLoading({ message = "Signing you in..." }: AuthLoadingProps) {
    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="flex h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Logo Animation */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.div
                            className="text-6xl"
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            🤖
                        </motion.div>

                        {/* Sparkles around logo */}
                        <motion.div
                            className="absolute -top-2 -right-2"
                            animate={{
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.2
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-2 -left-2"
                            animate={{
                                scale: [0, 1, 0],
                                rotate: [0, -180, -360],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.6
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-blue-500" />
                        </motion.div>

                        <motion.div
                            className="absolute top-1/2 -right-4"
                            animate={{
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1
                            }}
                        >
                            <Sparkles className="h-3 w-3 text-purple-500" />
                        </motion.div>
                    </motion.div>

                    {/* Loading Text */}
                    <div className="space-y-3 text-center">
                        <motion.h2
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {message}
                        </motion.h2>

                        {/* Loading dots */}
                        <div className="flex items-center justify-center gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    animate={{
                                        y: [0, -10, 0],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <motion.div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>

                    {/* Rotating loader */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Loader2 className="h-6 w-6 text-muted-foreground" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
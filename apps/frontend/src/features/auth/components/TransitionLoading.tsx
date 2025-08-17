"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface TransitionLoadingProps {
    userName?: string
    show: boolean
    onComplete?: () => void
}

export function TransitionLoading({ userName = "User", show, onComplete }: TransitionLoadingProps) {
    const [step, setStep] = useState(0)

    const steps = [
        "Verifying credentials...",
        "Setting up your workspace...",
        "Loading your dashboard...",
        `Welcome back, ${userName}!`
    ]

    useEffect(() => {
        if (show) {
            const timer1 = setTimeout(() => setStep(1), 800)  // Step 1: After login
            const timer2 = setTimeout(() => setStep(2), 1600) // Step 2: After refetchUser
            const timer3 = setTimeout(() => setStep(3), 2400) // Step 3: Final step
            const timer4 = setTimeout(() => {
                if (onComplete) onComplete()
            }, 3000) // Total duration: 3000ms to match Login component

            return () => {
                clearTimeout(timer1)
                clearTimeout(timer2)
                clearTimeout(timer3)
                clearTimeout(timer4)
            }
        } else {
            setStep(0)
        }
    }, [show, onComplete])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
                >
                    <div className="flex h-full items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center gap-8 max-w-md w-full px-4"
                        >
                            {/* Success Animation */}
                            <motion.div
                                className="relative"
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <motion.div
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    <CheckCircle className="h-12 w-12 text-white" />
                                </motion.div>

                                {/* Ripple effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-green-400"
                                    animate={{
                                        scale: [1, 1.5, 2],
                                        opacity: [0.5, 0.3, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                            </motion.div>

                            {/* Step Indicators */}
                            <div className="space-y-4 w-full">
                                {steps.map((text, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{
                                            opacity: step >= index ? 1 : 0.3,
                                            x: 0,
                                        }}
                                        transition={{ delay: index * 0.2 }}
                                        className="flex items-center gap-3"
                                    >
                                        <motion.div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= index
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                                    : "bg-gray-300 dark:bg-gray-600"
                                                }`}
                                            animate={step >= index ? {
                                                scale: [1, 1.2, 1],
                                            } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {step > index ? (
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            ) : (
                                                <div className={`w-2 h-2 rounded-full ${step === index ? "bg-white animate-pulse" : "bg-gray-400"
                                                    }`} />
                                            )}
                                        </motion.div>

                                        <motion.p
                                            className={`text-sm font-medium ${step >= index
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                                }`}
                                        >
                                            {text}
                                        </motion.p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Loading bar */}
                            <div className="w-full max-w-xs">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
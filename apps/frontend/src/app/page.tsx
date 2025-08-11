"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WelcomeScreen } from "@/features/welcome"
import { AuthModal } from "@/features/auth"
import { motion, AnimatePresence } from "framer-motion"
import { userService } from "@/features/user"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("smart-task-user")
    if (savedUser) {
      setShowWelcome(false)
      // Redirect to dashboard if user is logged in
      router.push("/dashboard")
    }
    setIsLoading(false)
  }, [router])

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  const handleLogin = (userData: any) => {
    localStorage.setItem("smart-task-user", JSON.stringify(userData))
    // Hydrate with full profile in background
    userService.getProfile().then((profile) => {
      localStorage.setItem("smart-task-user", JSON.stringify(profile))
    }).catch(() => { })
    setShowWelcome(false)
    setShowAuthModal(false)
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1, repeat: Number.POSITIVE_INFINITY },
          }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen onGetStarted={handleGetStarted} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onLogin={handleLogin} />
    </>
  )
}

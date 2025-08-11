"use client"

import { AuthModal } from "@/features/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { userService } from "@/features/user"

export default function LoginPage() {
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("smart-task-user")
    if (savedUser) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = (userData: any) => {
    localStorage.setItem("smart-task-user", JSON.stringify(userData))
    // Hydrate with full profile in background
    userService.getProfile().then((profile) => {
      localStorage.setItem("smart-task-user", JSON.stringify(profile))
    }).catch(() => { })
    router.push("/dashboard")
  }

  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onLogin={handleLogin}
      />
    </div>
  )
}

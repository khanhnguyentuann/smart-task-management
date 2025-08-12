"use client"

import { AuthModal } from "@/features/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser, UserProvider } from "@/features/layout"

function LoginPageContent() {
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(true)
  const { user, isInitialized } = useUser()

  useEffect(() => {
    // Check if user is already logged in via UserContext
    if (isInitialized && user) {
      router.push("/dashboard")
    }
  }, [user, isInitialized, router])

  const handleLogin = (userData: any) => {
    // User data will be handled by UserContext
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

export default function LoginPage() {
  return (
    <UserProvider>
      <LoginPageContent />
    </UserProvider>
  )
}

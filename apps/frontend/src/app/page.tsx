"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen"
import { useAuth } from "@/contexts/AuthContext"
import { ROUTES } from "@/constants"
import { LoadingScreen } from "@/components/common/LoadingScreen"

export default function Home() {
  const router = useRouter()
  const { loading, isAuthenticated } = useAuth()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [loading, isAuthenticated, router])

  const handleGetStarted = () => {
    router.push(ROUTES.LOGIN)
  }

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />
  }

  // Don't show welcome screen for authenticated users
  if (isAuthenticated) {
    return null
  }

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
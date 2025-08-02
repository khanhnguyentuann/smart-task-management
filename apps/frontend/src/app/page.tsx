"use client"

import { useRouter } from "next/navigation"
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen"
import { ROUTES } from "@/constants"

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push(ROUTES.LOGIN)
  }

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
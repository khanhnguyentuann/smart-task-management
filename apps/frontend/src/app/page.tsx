"use client"

import { useRouter } from "next/navigation"
import { WelcomeScreen } from "@/components/welcome/welcome-screen"

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/register")
  }

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
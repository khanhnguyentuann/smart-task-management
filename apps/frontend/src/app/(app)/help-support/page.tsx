"use client"

import { HelpSupport } from "@/features/help"
import { useUser } from "@/features/layout"

export default function HelpSupportPage() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return <HelpSupport user={user} />
}

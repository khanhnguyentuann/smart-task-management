"use client"

import { Settings } from "@/features/settings"
import { useUser } from "@/features/layout"

export default function SettingsPage() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return <Settings user={user} />
}

"use client"

import { Profile } from "@/features/user"
import { ProtectedRoute } from "@/shared/components/auth"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  )
}

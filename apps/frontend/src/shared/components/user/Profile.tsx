"use client"

import { CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Camera, Mail, User, Building, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"

interface ProfileProps {
  user: {
    id: string
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
    department?: string
  }
}

export function Profile({ user }: ProfileProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Avatar className="h-20 w-20 ring-4 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="text-sm">
                        {user.role}
                      </Badge>
                      {user.department && (
                        <Badge variant="outline" className="text-sm">
                          {user.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" defaultValue={user.name} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" defaultValue={user.email} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="department" defaultValue={user.department || "Not specified"} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="role" defaultValue={user.role} disabled className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <EnhancedButton>Save Changes</EnhancedButton>
                  <EnhancedButton variant="outline">Cancel</EnhancedButton>
                </div>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="joined">Joined Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="joined" defaultValue="January 2024" disabled className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="location" placeholder="Add your location" className="pl-10" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Change Password
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Login History
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Notification Settings
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Language & Region
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Privacy Settings
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
"use client"

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  SidebarTrigger,
  GlassmorphismCard,
  EnhancedButton 
} from "@/shared/components/ui"
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Database, Users } from "lucide-react"
import { motion } from "framer-motion"

interface SettingsProps {
  user: any
}

export function Settings({ user }: SettingsProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Configure your notification preferences</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Notification Settings
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Manage your account security settings</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Change Password
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Customize your interface appearance</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Theme Settings
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Language & Region
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Manage team members and permissions</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Team Members
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Permissions
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 

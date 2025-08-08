"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card/Card"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { HelpCircle, BookOpen, MessageCircle, Mail, Phone, FileText, Video, Users } from "lucide-react"
import { motion } from "framer-motion"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"

interface HelpSupportProps {
  user: any
}

export function HelpSupport({ user }: HelpSupportProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-semibold">Help & Support</h1>
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
                  <BookOpen className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Learn how to use Smart Task Management effectively</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  User Guide
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Tutorials
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
                  <MessageCircle className="h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Get help from our support team</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Support
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
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
                  <Users className="h-5 w-5" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Connect with other users and share experiences</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Community Forum
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Feature Requests
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
                  <HelpCircle className="h-5 w-5" />
                  FAQ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Frequently asked questions and answers</p>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Browse FAQ
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Search Help
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
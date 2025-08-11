"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useToast } from "@/shared/hooks/useToast"
import { AUTH_CONSTANTS } from "../constants"
import type { AuthModalProps } from "../types"
import { Login } from "./Login"
import { Register } from "./Register"
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const { toast } = useToast()

  const handleSocialLogin = (
    provider: (typeof AUTH_CONSTANTS.SOCIAL_PROVIDERS)[keyof typeof AUTH_CONSTANTS.SOCIAL_PROVIDERS]
  ) => {
    toast({
      title: AUTH_CONSTANTS.MESSAGES.SOCIAL_COMING_SOON,
      description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be available soon. Stay tuned!`,
      variant: "default",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Join Smart Task"}
              </span>
            </motion.div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isLogin ? "Sign in to your Smart Task account" : "Create a new Smart Task account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 0, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 0, height: 0 }}
            >
              {isLogin ? (
                <Login onSuccess={onLogin} onClose={() => onOpenChange(false)} />
              ) : (
                <Register onSuccess={onLogin} onClose={() => onOpenChange(false)} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin(AUTH_CONSTANTS.SOCIAL_PROVIDERS.GOOGLE)}
              className="w-full"
            >
              <FcGoogle className="h-4 w-4 mr-2" aria-hidden />
              Google
            </EnhancedButton>
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin(AUTH_CONSTANTS.SOCIAL_PROVIDERS.FACEBOOK)}
              className="w-full"
            >
              <FaFacebook className="h-4 w-4 mr-2 text-[#1877F2]" aria-hidden />
              Facebook
            </EnhancedButton>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

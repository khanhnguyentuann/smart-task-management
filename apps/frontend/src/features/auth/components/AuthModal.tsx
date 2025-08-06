"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { LoadingAnimation } from "@/shared/components/ui/loading-animation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: any) => void
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Mock users with realistic avatars
  const mockUsers = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@company.com",
      role: "Admin" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
      department: "Product Design",
    },
    {
      id: "2",
      name: "Alex Rodriguez",
      email: "alex@company.com",
      role: "Member" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf",
      department: "Engineering",
    },
    {
      id: "3",
      name: "Emily Johnson",
      email: "emily@company.com",
      role: "Admin" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=d1d4f9",
      department: "Marketing",
    },
    {
      id: "4",
      name: "Michael Kim",
      email: "michael@company.com",
      role: "Member" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0f2d9",
      department: "Engineering",
    },
    {
      id: "5",
      name: "Jessica Taylor",
      email: "jessica@company.com",
      role: "Member" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffd5dc",
      department: "Sales",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate confirm password for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (isLogin) {
      // Find user by email or use first user as default
      const user = mockUsers.find((u) => u.email === formData.email) || mockUsers[0]
      onLogin(user)
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: "Member" as const,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}&backgroundColor=f0f0f0`,
        department: "New Team",
      }
      onLogin(newUser)
    }

    setLoading(false)
    onOpenChange(false)
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  const handleQuickLogin = (user: any) => {
    onLogin(user)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {isLogin ? "Welcome Back!" : "Join Smart Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Login Options */}
          {isLogin && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Quick login as:</p>
              <div className="grid grid-cols-2 gap-2">
                {mockUsers.slice(0, 4).map((user) => (
                  <motion.button
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=6366f1&textColor=ffffff`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Login/Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center">
              <EnhancedButton type="submit" disabled={loading} className="w-full max-w-xs">
                {loading ? (
                  <LoadingAnimation type="dots" size="sm" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isLogin ? "Sign In" : "Create Account"}
                  </>
                )}
              </EnhancedButton>
            </div>
          </form>

          {/* Toggle between login/register */}
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
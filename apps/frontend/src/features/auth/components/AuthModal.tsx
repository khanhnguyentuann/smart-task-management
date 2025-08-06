"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { LoadingAnimation } from "@/shared/components/ui/loading-animation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle, XCircle } from "lucide-react"
import { validatePassword, validateConfirmPassword, getStrengthColor, getStrengthText } from "../utils/passwordValidation"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "@/shared/components/ui/use-toast"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: any) => void
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    strength: 'weak' as 'weak' | 'medium' | 'strong',
    errors: [] as string[],
  })

  const confirmPasswordValid = formData.password === formData.confirmPassword

  useEffect(() => {
    if (!isLogin && formData.password) {
      const validation = validatePassword(formData.password)
      setPasswordValidation(validation)
    }
  }, [formData.password, isLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password)
        toast({
          title: "🎉 Welcome back!",
          description: `Successfully logged in as ${user.firstName} ${user.lastName}`,
          variant: "default",
        })
        onLogin(user)
        onOpenChange(false)
      } else {
        if (!passwordValidation.isValid) {
          toast({
            title: "❌ Invalid password",
            description: "Please ensure your password meets all requirements",
            variant: "destructive",
          })
          return
        }

        if (!confirmPasswordValid) {
          toast({
            title: "❌ Passwords don't match",
            description: "Please ensure both passwords are identical",
            variant: "destructive",
          })
          return
        }

        const user = await register(formData.firstName, formData.lastName, formData.email, formData.password)
        toast({
          title: "🎉 Account created!",
          description: `Welcome to Smart Task, ${user.firstName}! Your account has been created successfully.`,
          variant: "default",
        })
        onLogin(user)
        onOpenChange(false)
      }
    } catch (error: any) {
      toast({
        title: "❌ Authentication failed",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    toast({
      title: "🚀 Coming Soon!",
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
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
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
                  className={`pl-10 pr-10 ${!isLogin && formData.password ? (passwordValidation.isValid ? 'border-green-500' : 'border-red-500') : ''}`}
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
              
              {/* Password validation for registration */}
              {!isLogin && formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${getStrengthColor(passwordValidation.strength)}`}>
                      Strength: {getStrengthText(passwordValidation.strength)}
                    </span>
                  </div>
                  
                  {passwordValidation.errors.length > 0 && (
                    <div className="space-y-1">
                      {passwordValidation.errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-red-500">
                          <XCircle className="h-3 w-3" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {passwordValidation.isValid && (
                    <div className="flex items-center gap-2 text-xs text-green-500">
                      <CheckCircle className="h-3 w-3" />
                      Password meets all requirements
                    </div>
                  )}
                </div>
              )}
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
                      className={`pl-10 ${formData.confirmPassword ? (confirmPasswordValid ? 'border-green-500' : 'border-red-500') : ''}`}
                      required={!isLogin}
                    />
                  </div>
                  
                  {/* Confirm password validation */}
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-xs">
                      {confirmPasswordValid ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
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

          {/* Social Login Section */}
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
              onClick={() => handleSocialLogin('google')}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </EnhancedButton>
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </EnhancedButton>
          </div>

          {/* Toggle between login/register */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                // Reset form when switching modes
                setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
              }}
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
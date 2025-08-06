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

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: any) => void
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
    strength: 'weak' as 'weak' | 'medium' | 'strong'
  })
  
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false)

  // Real-time password validation
  useEffect(() => {
    if (formData.password) {
      const validation = validatePassword(formData.password)
      setPasswordValidation(validation)
    } else {
      setPasswordValidation({ isValid: false, errors: [], strength: 'weak' })
    }
  }, [formData.password])

  // Real-time confirm password validation
  useEffect(() => {
    if (formData.confirmPassword) {
      const isValid = validateConfirmPassword(formData.password, formData.confirmPassword)
      setConfirmPasswordValid(isValid)
    } else {
      setConfirmPasswordValid(false)
    }
  }, [formData.password, formData.confirmPassword])

  // Clear error when switching modes
  useEffect(() => {
    setError("")
  }, [isLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate confirm password for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    
    // Validate password for registration
    if (!isLogin && !passwordValidation.isValid) {
      setError("Please fix password validation errors!")
      return
    }
    
    setLoading(true)

    try {
      if (isLogin) {
        // Use real API login
        const user = await login(formData.email, formData.password)
        onLogin(user)
        onOpenChange(false)
        // Reset form after successful login
        setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
      } else {
        // Use real API registration
        const user = await register(formData.firstName, formData.lastName, formData.email, formData.password)
        onLogin(user)
        onOpenChange(false)
        // Reset form after successful registration
        setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError(err.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
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
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{error}</p>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="First name"
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
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="pl-10"
                          required={!isLogin}
                        />
                      </div>
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
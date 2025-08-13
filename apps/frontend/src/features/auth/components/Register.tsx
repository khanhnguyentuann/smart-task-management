"use client"

import { useMemo, useState } from "react"
import { Input, Label, EnhancedButton } from "@/shared/components/ui"
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react"
import { useToast } from "@/shared/hooks/useToast"
import { useRegister } from "@/features/auth"
import { useErrorHandler } from "@/shared/hooks"
import { useUser } from "@/features/layout"
import { AUTH_CONSTANTS } from "@/shared/constants"
import { getStrengthMeta } from "../utils"
import { registerSchema, validatePassword, type RegisterFormData } from "../validation"
import type { RegisterProps } from "../types"
import { motion, AnimatePresence } from "framer-motion"

export function Register({ onSuccess, onClose }: RegisterProps) {
    const { toast } = useToast()
    const { register } = useRegister()
    const { refetchUser } = useUser()
    const { handleAuthError, handleValidationError } = useErrorHandler({
        context: { component: 'Register' }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})

    const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password])
    const rule = passwordValidation.rules
    const passedCount = useMemo(() => [rule.minOk, rule.maxOk, rule.upperOk, rule.lowerOk, rule.digitOk, rule.specialOk].filter(Boolean).length, [rule])
    const progressPercent = Math.round((passedCount / 6) * 100)
    const { label: strengthLabel, textClass: strengthTextClass, barClass: strengthBarClass } = getStrengthMeta(passwordValidation.strength)
    const showPasswordHelp = isPasswordFocused

    // Clear field error when user starts typing
    const handleFieldChange = (field: keyof RegisterFormData, value: string) => {
        setFormData({ ...formData, [field]: value })
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: undefined })
        }
    }

    // Removed unused isValid state and effect

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Clear previous field errors
        setFieldErrors({})
        
        const regValidation = registerSchema.safeParse(formData)
        if (!regValidation.success) {
            // Map Zod errors to field-specific errors
            const errors: Partial<Record<keyof RegisterFormData, string>> = {}
            regValidation.error.errors.forEach((error) => {
                const field = error.path[0] as keyof RegisterFormData
                if (field) {
                    errors[field] = error.message
                }
            })
            setFieldErrors(errors)
            
            // Show first error in toast
            const firstError = regValidation.error.errors[0]?.message || 'Invalid form data'
            handleValidationError(new Error(firstError), 'form')
            return
        }

        try {
            const { user } = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            })

            // Fetch full user profile after registration
            await refetchUser()

            toast({
                title: AUTH_CONSTANTS.MESSAGES.REGISTER_SUCCESS,
                description: `Welcome to Smart Task, ${user.firstName}! Your account has been created successfully.`,
                variant: "default",
            })

            onSuccess(user)
            onClose()
        } catch (error: any) {
            // Clear field errors on server error
            setFieldErrors({})
            handleAuthError(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="firstName" 
                            placeholder="Enter your first name" 
                            value={formData.firstName} 
                            onChange={(e) => handleFieldChange('firstName', e.target.value)} 
                            className={`pl-10 ${fieldErrors.firstName ? 'border-red-500' : ''}`} 
                            required 
                        />
                    </div>
                    {fieldErrors.firstName && (
                        <p className="text-sm text-red-500">{fieldErrors.firstName}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="lastName" 
                            placeholder="Enter your last name" 
                            value={formData.lastName} 
                            onChange={(e) => handleFieldChange('lastName', e.target.value)} 
                            className={`pl-10 ${fieldErrors.lastName ? 'border-red-500' : ''}`} 
                            required 
                        />
                    </div>
                    {fieldErrors.lastName && (
                        <p className="text-sm text-red-500">{fieldErrors.lastName}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={formData.email} 
                        onChange={(e) => handleFieldChange('email', e.target.value)} 
                        className={`pl-10 ${fieldErrors.email ? 'border-red-500' : ''}`} 
                        required 
                    />
                </div>
                {fieldErrors.email && (
                    <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        value={formData.password} 
                        onChange={(e) => handleFieldChange('password', e.target.value)} 
                        onFocus={() => setIsPasswordFocused(true)} 
                        onBlur={() => setIsPasswordFocused(false)} 
                        className={`pl-10 pr-10 ${fieldErrors.password ? 'border-red-500' : ''}`} 
                        required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {fieldErrors.password && (
                    <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}

                <AnimatePresence>
                    {showPasswordHelp && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <span className={`font-medium ${strengthTextClass}`}>Strength: {strengthLabel}</span>
                            </div>
                            <div className="h-2 w-full rounded bg-muted overflow-hidden">
                                <div className={`${strengthBarClass} h-full transition-all duration-300`} style={{ width: `${progressPercent}%` }} />
                            </div>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li className={`flex items-center gap-2 ${rule.minOk ? 'text-green-500' : 'text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${rule.minOk ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />{AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN}</li>
                                <li className={`flex items-center gap-2 ${rule.maxOk ? 'text-green-500' : 'text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${rule.maxOk ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />{AUTH_CONSTANTS.VALIDATION.PASSWORD_MAX}</li>
                                <li className={`flex items-center gap-2 ${rule.upperOk ? 'text-green-500' : 'text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${rule.upperOk ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />{AUTH_CONSTANTS.VALIDATION.PASSWORD_UPPER}</li>
                                <li className={`flex items-center gap-2 ${rule.lowerOk ? 'text-green-500' : 'text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${rule.lowerOk ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />{AUTH_CONSTANTS.VALIDATION.PASSWORD_LOWER}</li>
                                <li className={`flex items-center gap-2 ${rule.digitOk ? 'text-green-500' : 'text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${rule.digitOk ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />{AUTH_CONSTANTS.VALIDATION.PASSWORD_DIGIT}</li>
                                <li className={`flex items-center gap-2 ${rule.specialOk ? 'text-green-500' : 'text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${rule.specialOk ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />{AUTH_CONSTANTS.VALIDATION.PASSWORD_SPECIAL}</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="confirmPassword" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Confirm your password" 
                        value={formData.confirmPassword} 
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)} 
                        className={`pl-10 ${fieldErrors.confirmPassword ? 'border-red-500' : formData.confirmPassword ? (formData.password === formData.confirmPassword ? 'border-green-500' : 'border-red-500') : ''}`} 
                        required 
                    />
                </div>
                {fieldErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                )}
            </div>

            <div className="flex justify-center">
                <EnhancedButton type="submit" className="w-full max-w-xs">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Account
                </EnhancedButton>
            </div>
        </form>
    )
}



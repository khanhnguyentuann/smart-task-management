"use client"

import { useState } from "react"
import { Input, Label, EnhancedButton } from "@/shared/components/ui"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { useToast } from "@/shared/hooks/useToast"
import { useLogin } from "@/features/auth"
import { useErrorHandler } from "@/shared/hooks"
import { useUser } from "@/features/layout"
import { AUTH_CONSTANTS } from "@/shared/constants"
import { LoginProps } from "../types"

export function Login({ onSuccess, onClose }: LoginProps) {
    const { toast } = useToast()
    const { login } = useLogin()
    const { refetchUser } = useUser()
    const { handleAuthError } = useErrorHandler({
        context: { component: 'Login' }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ email: "", password: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { user } = await login({
                email: formData.email,
                password: formData.password,
            })
            
            // Fetch full user profile after login
            await refetchUser()
            
            toast({
                title: AUTH_CONSTANTS.MESSAGES.LOGIN_SUCCESS,
                description: `Successfully logged in as ${user.firstName} ${user.lastName}`,
                variant: "default",
            })
            onSuccess(user)
            onClose()
        } catch (error: any) {
            handleAuthError(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="flex justify-center">
                <EnhancedButton type="submit" className="w-full max-w-xs">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Sign In
                </EnhancedButton>
            </div>
        </form>
    )
}



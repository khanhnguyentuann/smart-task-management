"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Mail, Sparkles } from "lucide-react"
import { LoginFormData, ValidationError } from "@/utils/form-validation"

interface LoginFormProps {
    formData: LoginFormData
    errors: ValidationError
    loading: boolean
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function LoginForm({ formData, errors, loading, onSubmit, onChange }: LoginFormProps) {
    return (
        <motion.form
            onSubmit={onSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vutrumanhoa@gmail.com"
                        value={formData.email}
                        onChange={onChange}
                        className="pl-10"
                        required
                    />
                </div>
                {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
            </div>

            <PasswordInput
                id="password"
                name="password"
                label="Mật khẩu"
                placeholder="••••••"
                value={formData.password}
                onChange={onChange}
                error={errors.password}
                required
            />

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={formData.remember}
                        onChange={onChange}
                        className="accent-primary h-4 w-4 rounded"
                    />
                    Ghi nhớ đăng nhập
                </label>
                <Link
                    href="/forgot-password"
                    className="text-primary text-sm font-medium hover:underline transition-colors"
                >
                    Quên mật khẩu?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all min-h-[44px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
                {loading ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                        >
                            <Sparkles className="h-4 w-4" />
                        </motion.div>
                        Đang đăng nhập...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Đăng nhập
                    </>
                )}
            </Button>
        </motion.form>
    )
}
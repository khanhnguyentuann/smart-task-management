"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Mail, Sparkles, Loader2 } from "lucide-react"
import { RegisterFormData, ValidationError } from "@/utils/form-validation"

interface RegisterFormProps {
    formData: RegisterFormData
    errors: ValidationError
    loading: boolean
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function RegisterForm({
    formData,
    errors,
    loading,
    onSubmit,
    onChange
}: RegisterFormProps) {
    return (
        <motion.form
            onSubmit={onSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
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
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={onChange}
                error={errors.password}
                required
            />

            <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={onChange}
                error={errors.confirmPassword}
                required
            />

            <Button
                type="submit"
                disabled={loading}
                className="w-full text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-6"
            >
                {loading ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                        >
                            <Loader2 className="h-4 w-4" />
                        </motion.div>
                        Đang tạo tài khoản...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Tạo tài khoản miễn phí
                    </>
                )}
            </Button>
        </motion.form>
    )
}
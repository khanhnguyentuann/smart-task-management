"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Mail, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { RegisterFormData } from "@/schemas/auth.schema"
import { VALIDATION_CONFIG } from "@/constants/config"

interface ValidationError {
    email?: string
    password?: string
    confirmPassword?: string
    [key: string]: string | undefined
}

interface TouchedFields {
    email?: boolean
    password?: boolean
    confirmPassword?: boolean
    [key: string]: boolean | undefined
}

interface RegisterFormProps {
    formData: RegisterFormData
    errors: ValidationError
    touched: TouchedFields
    loading: boolean
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

export function RegisterForm({
    formData,
    errors,
    touched,
    loading,
    onSubmit,
    onChange,
    onBlur
}: RegisterFormProps) {
    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;
    const showConfirmPasswordError = touched.confirmPassword && errors.confirmPassword;

    return (
        <motion.form
            onSubmit={onSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            {/* Email Field */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={onChange}
                    onBlur={onBlur}
                    leftIcon={<Mail className="h-4 w-4" />}
                    rightIcon={showEmailError ? <AlertCircle className="h-4 w-4 text-red-500" /> : undefined}
                    error={!!showEmailError}
                    required
                />
                {showEmailError && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                    >
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                    </motion.span>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <PasswordInput
                    id="password"
                    name="password"
                    label="Mật khẩu"
                    placeholder={`Tối thiểu ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} ký tự`}
                    value={formData.password}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.password}
                    showError={!!showPasswordError}
                    showLabel={true}
                    required
                />
                {showPasswordError && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                    >
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                    </motion.span>
                )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword}
                    showError={!!showConfirmPasswordError}
                    showLabel={true}
                    required
                />
                {showConfirmPasswordError && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                    >
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                    </motion.span>
                )}
            </div>

            {/* Submit Button */}
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
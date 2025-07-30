"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "MEMBER" as "ADMIN" | "MEMBER"
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})

    // Validation realtime
    const validate = () => {
        const errs: { email?: string; password?: string; confirmPassword?: string } = {}
        if (!formData.email) {
            errs.email = "Vui lòng nhập email"
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            errs.email = "Email không hợp lệ"
        }
        if (!formData.password) {
            errs.password = "Vui lòng nhập mật khẩu"
        } else if (formData.password.length < 6) {
            errs.password = "Mật khẩu phải có ít nhất 6 ký tự"
        }
        if (!formData.confirmPassword) {
            errs.confirmPassword = "Vui lòng xác nhận mật khẩu"
        } else if (formData.password !== formData.confirmPassword) {
            errs.confirmPassword = "Mật khẩu không khớp"
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        try {
            const { confirmPassword, ...registerData } = formData
            const response = await authService.register(registerData)

            toast({
                title: "Đăng ký thành công!",
                description: "Đang chuyển hướng..."
            })

            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
        } catch (error: any) {
            // Handle specific error cases
            let errorMessage = "Không thể tạo tài khoản"
            
            if (error.response?.status === 409) {
                errorMessage = "Email đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập."
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }

            toast({
                title: "Lỗi đăng ký",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <Card className="rounded-2xl shadow-2xl border-0 p-0 overflow-hidden animate-fade-in">
                    <CardHeader className="space-y-2 flex flex-col items-center bg-white/80 dark:bg-gray-900/80 pt-8 pb-4">
                        {/* Logo */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-1">
                                <span>S</span>
                            </div>
                            <span className="text-xl font-semibold text-primary">Smart Task</span>
                            <span className="text-xs text-muted-foreground">Quản lý công việc thông minh, hiệu quả vượt trội</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center mt-2">
                            Tạo tài khoản mới
                        </CardTitle>
                        <CardDescription className="text-center">
                            Điền thông tin để bắt đầu sử dụng hệ thống
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-white/80 dark:bg-gray-900/80 px-8 pb-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                leftIcon={<Mail className="h-4 w-4" />}
                                autoFocus
                                error={!!errors.email}
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                            />
                            {errors.email && <span id="email-error" className="text-xs text-destructive">{errors.email}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Tối thiểu 6 ký tự"
                                value={formData.password}
                                onChange={handleChange}
                                leftIcon={<Lock className="h-4 w-4" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="text-muted-foreground hover:text-primary focus:outline-none"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                }
                                error={!!errors.password}
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                            />
                            {errors.password && <span id="password-error" className="text-xs text-destructive">{errors.password}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                leftIcon={<Lock className="h-4 w-4" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="text-muted-foreground hover:text-primary focus:outline-none"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                }
                                error={!!errors.confirmPassword}
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby="confirm-password-error"
                            />
                            {errors.confirmPassword && <span id="confirm-password-error" className="text-xs text-destructive">{errors.confirmPassword}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Vai trò</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: "ADMIN" | "MEMBER") =>
                                    setFormData({ ...formData, role: value })
                                }
                            >
                                <SelectTrigger id="role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MEMBER">Thành viên</SelectItem>
                                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-white/80 dark:bg-gray-900/80 px-8 pb-8 pt-4">
                        <Button
                            type="submit"
                            className="w-full text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all min-h-[44px]"
                            disabled={loading}
                            loading={loading}
                        >
                            Đăng ký
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Đã có tài khoản?{' '}
                            <Link href="/login" className="text-primary font-medium hover:underline focus:underline focus:outline-none transition-colors">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
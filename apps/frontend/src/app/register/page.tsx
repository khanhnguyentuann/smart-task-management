"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Loader2,
    Sparkles,
    Shield,
    Star,
    Zap,
    Users,
    BarChart3,
    Globe,
    Award,
    TrendingUp,
} from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "MEMBER" as "ADMIN" | "MEMBER"
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
        firstName?: string;
        lastName?: string;
    }>({})

    // Benefits data
    const benefits = [
        {
            icon: Zap,
            title: "Boost Productivity",
            description: "Tăng hiệu suất làm việc lên 300% với AI automation"
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Kết nối và làm việc nhóm hiệu quả hơn bao giờ hết"
        },
        {
            icon: BarChart3,
            title: "Smart Analytics",
            description: "Phân tích dữ liệu thông minh và báo cáo chi tiết"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bảo mật cấp doanh nghiệp, an toàn tuyệt đối"
        },
        {
            icon: Globe,
            title: "Global Access",
            description: "Truy cập mọi lúc mọi nơi trên tất cả thiết bị"
        },
        {
            icon: Award,
            title: "Premium Support",
            description: "Hỗ trợ 24/7 từ đội ngũ chuyên gia hàng đầu"
        }
    ]

    // Achievements
    const achievements = [
        { icon: Users, number: "100K+", label: "Happy Users" },
        { icon: Star, number: "4.9/5", label: "Rating" },
        { icon: TrendingUp, number: "300%", label: "Productivity Boost" },
        { icon: Globe, number: "150+", label: "Countries" }
    ]

    const validate = () => {
        const errs: {
            email?: string;
            password?: string;
            confirmPassword?: string;
            firstName?: string;
            lastName?: string;
        } = {}

        if (!formData.firstName.trim()) {
            errs.firstName = "Vui lòng nhập họ"
        }
        if (!formData.lastName.trim()) {
            errs.lastName = "Vui lòng nhập tên"
        }
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
            const registerData = { ...formData }
            await authService.register(registerData)

            toast({
                title: "🎉 Chào mừng bạn đến với Smart Task!",
                description: "Tài khoản đã được tạo thành công"
            })

            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
        } catch (error: any) {
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
                    {/* Left Side - Benefits & Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Main Branding */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="flex items-center gap-4"
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, -10, 10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 flex items-center justify-center text-white shadow-2xl"
                                >
                                    <Sparkles className="h-8 w-8" />
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Smart Task
                                    </h1>
                                    <p className="text-lg text-muted-foreground">
                                        Tương lai của quản lý dự án
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Gia nhập cộng đồng 100K+ 🚀
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Trở thành một phần của cuộc cách mạng productivity. Miễn phí 30 ngày đầu, không cần thẻ tín dụng.
                                </p>
                            </motion.div>
                        </div>

                        {/* Benefits Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="inline-flex p-2 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg mb-3 group-hover:shadow-lg transition-shadow"
                                    >
                                        <benefit.icon className="h-4 w-4" />
                                    </motion.div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Achievements */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="flex justify-between p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20"
                        >
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.4 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-1">
                                        <achievement.icon className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        {achievement.number}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {achievement.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Register Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <Card className="w-full max-w-md rounded-2xl shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                            <CardHeader className="space-y-3 text-center pt-8 pb-6">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                >
                                    <CardTitle className="text-2xl font-bold">Tạo tài khoản miễn phí</CardTitle>
                                    <CardDescription>Chỉ mất 2 phút để bắt đầu</CardDescription>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="space-y-4 px-8 pb-6">
                                <motion.form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Họ</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="Nguyễn"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                            {errors.firstName && <span className="text-xs text-destructive">{errors.firstName}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Tên</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Văn A"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                            {errors.lastName && <span className="text-xs text-destructive">{errors.lastName}</span>}
                                        </div>
                                    </div>

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
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                        {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Tối thiểu 6 ký tự"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="pl-10 pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <span className="text-xs text-destructive">{errors.password}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Nhập lại mật khẩu"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="pl-10 pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <span className="text-xs text-destructive">{errors.confirmPassword}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Vai trò</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(value: "ADMIN" | "MEMBER") =>
                                                setFormData({ ...formData, role: value })
                                            }
                                        >
                                            <SelectTrigger id="role" className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MEMBER">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        Thành viên
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="ADMIN">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        Quản trị viên
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

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

                                    <div className="text-center pt-2">
                                        <p className="text-xs text-muted-foreground">
                                            Bằng cách đăng ký, bạn đồng ý với{' '}
                                            <Link href="/terms" className="text-primary hover:underline">
                                                Điều khoản sử dụng
                                            </Link>{' '}
                                            và{' '}
                                            <Link href="/privacy" className="text-primary hover:underline">
                                                Chính sách bảo mật
                                            </Link>
                                        </p>
                                    </div>
                                </motion.form>
                            </CardContent>

                            <CardFooter className="pt-4 pb-8 px-8">
                                <p className="text-sm text-center text-muted-foreground w-full">
                                    Đã có tài khoản?{' '}
                                    <Link
                                        href="/login"
                                        className="text-primary font-medium hover:underline transition-colors"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
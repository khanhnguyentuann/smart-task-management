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
import { useToast } from "@/components/ui/use-toast"
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Zap,
    Shield,
    Users,
    BarChart3,
} from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    // Mock users for quick login
    const mockUsers = [
        {
            id: "1",
            name: "Sarah Chen",
            email: "sarah@company.com",
            role: "Admin" as const,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            department: "Product Design",
        },
        {
            id: "2",
            name: "Alex Rodriguez",
            email: "alex@company.com",
            role: "Member" as const,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            department: "Engineering",
        },
        {
            id: "3",
            name: "Emily Johnson",
            email: "emily@company.com",
            role: "Admin" as const,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            department: "Marketing",
        },
        {
            id: "4",
            name: "Michael Kim",
            email: "michael@company.com",
            role: "Member" as const,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            department: "Engineering",
        },
    ]

    // Features data
    const features = [
        {
            icon: Zap,
            title: "AI-Powered",
            description: "Intelligent task prioritization and automation"
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Real-time collaboration with your team"
        },
        {
            icon: BarChart3,
            title: "Analytics",
            description: "Detailed insights and progress tracking"
        },
        {
            icon: Shield,
            title: "Secure",
            description: "Enterprise-grade security and privacy"
        }
    ]

    // Stats data
    const stats = [
        { number: "50K+", label: "Active Users" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" },
        { number: "150+", label: "Countries" }
    ]

    const validate = () => {
        const errs: { email?: string; password?: string } = {}
        if (!formData.email) {
            errs.email = "Vui lòng nhập email"
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            errs.email = "Email không hợp lệ"
        }
        if (!formData.password) {
            errs.password = "Vui lòng nhập mật khẩu"
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            })
            toast({
                title: "Đăng nhập thành công!",
                description: "Đang chuyển hướng..."
            })
            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
        } catch (error: any) {
            let errorMessage = "Email hoặc mật khẩu không đúng"

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }

            toast({
                title: "Lỗi đăng nhập",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleQuickLogin = async (user: any) => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: `Chào mừng ${user.name}!`,
                description: "Đăng nhập thành công"
            })

            setTimeout(() => {
                router.push("/dashboard")
            }, 500)
        } catch (error) {
            toast({
                title: "Lỗi đăng nhập",
                description: "Không thể đăng nhập với tài khoản này",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
                    {/* Left Side - Branding & Features */}
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
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center text-white shadow-2xl"
                                >
                                    <Sparkles className="h-8 w-8" />
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Smart Task
                                    </h1>
                                    <p className="text-lg text-muted-foreground">
                                        Quản lý công việc thông minh
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
                                    Chào mừng trở lại! 👋
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Nền tảng quản lý dự án hiện đại với AI, giúp team của bạn làm việc hiệu quả hơn mỗi ngày.
                                </p>
                            </motion.div>
                        </div>

                        {/* Features Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-2 gap-6"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="inline-flex p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg mb-3 group-hover:shadow-lg transition-shadow"
                                    >
                                        <feature.icon className="h-5 w-5" />
                                    </motion.div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex justify-between p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Login Form */}
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
                                    <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
                                    <CardDescription>Chọn tài khoản hoặc nhập thông tin</CardDescription>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="space-y-6 px-8 pb-6">
                                {/* Quick Login */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-3"
                                >
                                    <p className="text-sm text-muted-foreground text-center">Đăng nhập nhanh:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {mockUsers.map((user, index) => (
                                            <motion.button
                                                key={user.id}
                                                onClick={() => handleQuickLogin(user)}
                                                disabled={loading}
                                                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                            >
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-background group-hover:ring-primary/50 transition-all"
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
                                            <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Login Form */}
                                <motion.form
                                    onSubmit={handleSubmit}
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
                                                placeholder="••••••"
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

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={formData.remember}
                                                onChange={handleChange}
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
                            </CardContent>

                            <CardFooter className="pt-4 pb-8 px-8">
                                <p className="text-sm text-center text-muted-foreground w-full">
                                    Chưa có tài khoản?{' '}
                                    <Link
                                        href="/register"
                                        className="text-primary font-medium hover:underline transition-colors"
                                    >
                                        Đăng ký ngay
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
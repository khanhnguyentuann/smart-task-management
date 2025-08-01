"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { authService } from "@/services/auth.service"
import { User } from "@/types/auth"
import { useToast } from '@/contexts/ToastContext';
import {
    User as UserIcon,
    Mail,
    Shield,
    Calendar,
    Camera,
    Save,
    X,
    Lock,
    Eye,
    EyeOff
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"

export default function ProfilePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Form data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    })

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await authService.getMe()
                const userData = response.user
                setUser(userData)
                setFormData({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email,
                })
                if (userData.avatar) {
                    setAvatarPreview(userData.avatar)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // This will be implemented when backend is ready
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

            toast({
                title: "Cập nhật thành công",
                description: "Thông tin của bạn đã được cập nhật",
            })
            setIsEditing(false)

            // Update local state
            if (user) {
                setUser({
                    ...user,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                })
            }
        } catch (error) {
            console.error('Save failed:', error)
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật thông tin",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email,
            })
        }
        setIsEditing(false)
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast({
                    title: "File quá lớn",
                    description: "Vui lòng chọn ảnh dưới 5MB",
                    variant: "destructive"
                })
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePasswordChange = async () => {
        // Validate
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu mới không khớp",
                variant: "destructive"
            })
            return
        }

        if (passwordForm.newPassword.length < 6) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu mới phải có ít nhất 6 ký tự",
                variant: "destructive"
            })
            return
        }

        try {
            // This will be implemented when backend is ready
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: "Đổi mật khẩu thành công",
                description: "Mật khẩu của bạn đã được cập nhật",
            })
            setShowChangePassword(false)
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
        } catch (error) {
            console.error('Password change failed:', error)
            toast({
                title: "Lỗi",
                description: "Không thể đổi mật khẩu",
                variant: "destructive"
            })
        }
    }

    const getUserInitials = (user: User) => {
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        }
        return user.email.substring(0, 2).toUpperCase()
    }

    const getFullName = (user: User) => {
        if (user.firstName || user.lastName) {
            return `${user.firstName || ""} ${user.lastName || ""}`.trim()
        }
        return user.email
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        )
    }

    if (!user) return null

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Thông tin cá nhân</h1>
                        <p className="text-muted-foreground">
                            Quản lý thông tin và bảo mật tài khoản của bạn
                        </p>
                    </div>

                    {/* Avatar and Basic Info Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Thông tin cơ bản</CardTitle>
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant="outline">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            size="sm"
                                        >
                                            {isSaving ? (
                                                <Spinner size="sm" className="mr-2" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Lưu
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            size="sm"
                                            disabled={isSaving}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                                        <AvatarImage src={avatarPreview || user.avatar} alt={getFullName(user)} />
                                        <AvatarFallback className="text-lg bg-gradient-to-br from-primary/20 to-primary/10">
                                            {getUserInitials(user)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                                        >
                                            <Camera className="h-6 w-6 text-white" />
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{getFullName(user)}</h3>
                                    <p className="text-muted-foreground">{user.email}</p>
                                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="mt-2">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Họ</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, firstName: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        placeholder="Nhập họ của bạn"
                                        leftIcon={<UserIcon className="h-4 w-4" />}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Tên</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lastName: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        placeholder="Nhập tên của bạn"
                                        leftIcon={<UserIcon className="h-4 w-4" />}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        leftIcon={<Mail className="h-4 w-4" />}
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email không thể thay đổi
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Chi tiết tài khoản</CardTitle>
                            <CardDescription>
                                Thông tin về tài khoản và bảo mật
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 flex items-center gap-2">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        User ID
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                            {user.id}
                                        </code>
                                    </dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Ngày tham gia
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                        Mật khẩu
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowChangePassword(true)}
                                        >
                                            <Lock className="h-4 w-4 mr-2" />
                                            Đổi mật khẩu
                                        </Button>
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thống kê hoạt động</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">0</div>
                                    <p className="text-xs text-muted-foreground">Projects</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">0</div>
                                    <p className="text-xs text-muted-foreground">Tasks</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">0%</div>
                                    <p className="text-xs text-muted-foreground">Completion</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Change Password Dialog */}
                <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Đổi mật khẩu</DialogTitle>
                            <DialogDescription>
                                Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                <Input
                                    id="current-password"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) =>
                                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                                    }
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) =>
                                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                                    }
                                    placeholder="Tối thiểu 6 ký tự"
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                <Input
                                    id="confirm-password"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                                    }
                                    placeholder="Nhập lại mật khẩu mới"
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handlePasswordChange}>
                                Đổi mật khẩu
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardLayout>
        </ProtectedRoute>
    )
}
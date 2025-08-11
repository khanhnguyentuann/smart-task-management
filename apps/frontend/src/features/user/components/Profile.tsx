"use client"

import { CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card/Card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Camera, Mail, User, Building, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { useState } from "react"
import { useToast } from "@/shared/hooks/useToast"
import { useUser } from "@/features/layout"
import type { UserProfile } from "../types/user.types"
import { updateProfileSchema } from "../validation/user.validation"
import { userService } from "../services/user.service"

export function Profile() {
  const { toast } = useToast()
  const { user, setUser, refetchUser } = useUser()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Partial<UserProfile>>({})
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const toInputDate = (iso?: string | null) => (iso ? iso.substring(0, 10) : '')

  const validate = (values: Partial<UserProfile>) => {
    const result = updateProfileSchema.safeParse({
      firstName: values.firstName,
      lastName: values.lastName,
      department: values.department,
      dateOfBirth: (values as any).dateOfBirth ?? (values as any).birthday ?? '',
      avatar: values.avatar,
    })
    if (result.success) {
      setErrors({})
      return true
    }
    const fieldErrors: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const path = issue.path?.[0] as string | undefined
      if (path) fieldErrors[path] = issue.message
    }
    setErrors(fieldErrors)
    return false
  }

  if (!user) return null

  const onSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Update preview immediately
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setForm((prev) => ({ ...(prev ?? {}), avatar: base64 }))
    }
    reader.readAsDataURL(file)
    // Auto upload
    setLoading(true)
    try {
      const result = await userService.uploadAvatarFile(file)
      if (result?.avatar && user) {
        const updated = { ...user, avatar: result.avatar }
        setUser(updated)
        toast({
          title: "Ảnh đại diện đã được cập nhật",
          description: `${updated.firstName} ${updated.lastName} ảnh mới đã được lưu thành công.`,
          variant: "default",
        })
      }
    } catch {
      toast({ title: "Tải ảnh thất bại", description: "Vui lòng thử lại sau.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const onSave = async () => {
    if (!validate(form)) {
      toast({ title: "Thông tin chưa hợp lệ", description: "Vui lòng kiểm tra lại các trường nhập.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        department: form.department,
        dateOfBirth: (form as any).dateOfBirth ?? (form as any).birthday,
        avatar: form.avatar,
      }
      const updated = await userService.updateProfile(payload)
      setUser(updated)
      const changed: string[] = []
      if (payload.firstName && payload.firstName !== user?.firstName) changed.push("First name")
      if (payload.lastName && payload.lastName !== user?.lastName) changed.push("Last name")
      if (payload.department && payload.department !== user?.department) changed.push("Department")
      if (payload.dateOfBirth && payload.dateOfBirth !== (user as any)?.dateOfBirth) changed.push("Date of birth")
      const desc = changed.length > 0 ? `Đã cập nhật: ${changed.join(", ")}.` : "Không có thay đổi đáng kể."
      toast({
        title: "Cập nhật hồ sơ thành công",
        description: desc,
        variant: "default",
      })
    } catch (_err) {
      toast({ title: "Update failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Avatar className="h-20 w-20 ring-4 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                        <AvatarImage src={(form?.avatar ?? user.avatar) && (form?.avatar ?? user.avatar)?.startsWith('data:image') ? (form?.avatar ?? user.avatar) : ((form?.avatar ?? user.avatar) || '/default-avatar.svg')} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {`${user.firstName}${user.lastName}`}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onSelectAvatar} />
                      <Camera className="h-4 w-4" />
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
                    <div className="flex items-center gap-2">
                      {user.department && (
                        <Badge variant="outline" className="text-sm">
                          {user.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="firstName" value={(form.firstName ?? user.firstName) || ''} onBlur={() => validate(form)} onChange={(e) => setForm(f => ({ ...(f ?? {}), firstName: e.target.value }))} className="pl-10" />
                      </div>
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="lastName" value={(form.lastName ?? user.lastName) || ''} onBlur={() => validate(form)} onChange={(e) => setForm(f => ({ ...(f ?? {}), lastName: e.target.value }))} className="pl-10" />
                      </div>
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={user.email} disabled className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Birthday</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="dateOfBirth" type="date" value={toInputDate((form as any).dateOfBirth ?? (user as any).dateOfBirth ?? (user as any).birthday ?? '')} onBlur={() => validate(form)} onChange={(e) => setForm(f => ({ ...(f ?? {}), dateOfBirth: e.target.value }))} className="pl-10" />
                    </div>
                    {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="department" value={(form.department ?? user.department) || ''} onBlur={() => validate(form)} onChange={(e) => setForm(f => ({ ...(f ?? {}), department: e.target.value }))} className="pl-10" />
                    </div>
                    {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                  </div>

                </div>

                <div className="flex gap-2">
                  <EnhancedButton onClick={onSave} disabled={loading}>Save Changes</EnhancedButton>
                  <EnhancedButton variant="outline">Cancel</EnhancedButton>
                </div>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="joined">Joined Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="joined" defaultValue="January 2024" disabled className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="location" placeholder="Add your location" className="pl-10" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Change Password
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Login History
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GlassmorphismCard>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Notification Settings
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Language & Region
                </EnhancedButton>
                <EnhancedButton variant="outline" className="w-full justify-start">
                  Privacy Settings
                </EnhancedButton>
              </CardContent>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
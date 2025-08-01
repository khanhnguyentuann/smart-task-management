"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/services/auth.service"
import { LoginFormData, ValidationError, validateLoginForm } from "@/utils/form-validation"
import { isApiError } from "@/types/api"
import { MockUser } from "@/types/mock-user" // Import MockUser type

const initialLoginData: LoginFormData = {
    email: "",
    password: "",
    remember: false
}

export function useLoginForm() {
    const router = useRouter()
    const { toast } = useToast()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<LoginFormData>(initialLoginData)
    const [errors, setErrors] = useState<ValidationError>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type: inputType, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: inputType === "checkbox" ? checked : value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const validate = (): boolean => {
        const validationErrors = validateLoginForm(formData)
        setErrors(validationErrors)
        return Object.keys(validationErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await authService.login({
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

        } catch (error: unknown) {
            const errorMessage = isApiError(error) && error.response?.data?.message
                ? error.response.data.message
                : "Email hoặc mật khẩu không đúng"

            toast({
                title: "Lỗi đăng nhập",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleQuickLogin = async (user: MockUser) => {
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
            console.error('Quick login failed:', error)
            toast({
                title: "Lỗi đăng nhập",
                description: "Không thể đăng nhập với tài khoản này",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        formData,
        errors,
        handleChange,
        handleSubmit,
        handleQuickLogin
    }
}
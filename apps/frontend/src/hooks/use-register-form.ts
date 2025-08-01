"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/services/auth.service"
import { RegisterFormData, ValidationError, validateRegisterForm } from "@/utils/form-validation"

const initialRegisterData: RegisterFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "MEMBER"
}

export function useRegisterForm() {
    const router = useRouter()
    const { toast } = useToast()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<RegisterFormData>(initialRegisterData)
    const [errors, setErrors] = useState<ValidationError>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validate = (): boolean => {
        const validationErrors = validateRegisterForm(formData)
        setErrors(validationErrors)
        return Object.keys(validationErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await authService.register(formData)

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

    return {
        loading,
        formData,
        errors,
        handleChange,
        handleSelectChange,
        handleSubmit
    }
}
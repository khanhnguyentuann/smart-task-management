"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/services/auth.service"
import { 
    LoginFormData, 
    RegisterFormData, 
    ValidationError, 
    validateLoginForm, 
    validateRegisterForm 
} from "@/utils/form-validation"

const initialLoginData: LoginFormData = {
    email: "",
    password: "",
    remember: false
}

const initialRegisterData: RegisterFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "MEMBER"
}

// Generic overloads for proper typing
export function useAuthForm(type: 'login'): {
    loading: boolean
    formData: LoginFormData
    errors: ValidationError
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSelectChange: (name: string, value: string) => void
    handleSubmit: (e: React.FormEvent) => Promise<void>
    handleQuickLogin: (user: any) => Promise<void>
}

export function useAuthForm(type: 'register'): {
    loading: boolean
    formData: RegisterFormData
    errors: ValidationError
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSelectChange: (name: string, value: string) => void
    handleSubmit: (e: React.FormEvent) => Promise<void>
    handleQuickLogin: (user: any) => Promise<void>
}

export function useAuthForm(type: 'login' | 'register') {
    const router = useRouter()
    const { toast } = useToast()
    
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(
        type === 'login' ? initialLoginData : initialRegisterData
    )
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

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validate = (): boolean => {
        const validationErrors = type === 'login' 
            ? validateLoginForm(formData as LoginFormData)
            : validateRegisterForm(formData as RegisterFormData)
        
        setErrors(validationErrors)
        return Object.keys(validationErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        
        setLoading(true)
        try {
            if (type === 'login') {
                const loginData = formData as LoginFormData
                await authService.login({
                    email: loginData.email,
                    password: loginData.password
                })
                
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Đang chuyển hướng..."
                })
            } else {
                const registerData = formData as RegisterFormData
                await authService.register(registerData)
                
                toast({
                    title: "🎉 Chào mừng bạn đến với Smart Task!",
                    description: "Tài khoản đã được tạo thành công"
                })
            }
            
            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
            
        } catch (error: any) {
            let errorMessage = type === 'login' 
                ? "Email hoặc mật khẩu không đúng"
                : "Không thể tạo tài khoản"

            if (error.response?.status === 409) {
                errorMessage = "Email đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập."
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }

            toast({
                title: type === 'login' ? "Lỗi đăng nhập" : "Lỗi đăng ký",
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
        } catch {
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
        handleSelectChange,
        handleSubmit,
        handleQuickLogin
    }
}
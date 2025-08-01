"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import { isApiError, getErrorMessage } from '@/types/api';
import { MockUser } from '@/types/mock-user';

export function useLoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();
    const [quickLoginLoading, setQuickLoginLoading] = useState(false);

    const form = useForm<LoginFormData>({
        initialValues: {
            email: '',
            password: '',
            remember: false,
        },
        schema: loginSchema,
        onSubmit: async (values) => {
            try {
                await login(values.email, values.password);
                toast({
                    title: SUCCESS_MESSAGES.LOGIN,
                    description: 'Đang chuyển hướng...',
                    variant: 'success',
                });
            } catch (error) {
                const errorMessage = isApiError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : ERROR_MESSAGES.LOGIN_FAILED;

                toast({
                    title: 'Lỗi đăng nhập',
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
        },
    });

    const handleQuickLogin = async (user: MockUser) => {
        try {
            setQuickLoginLoading(true);
            // Mock login for demo
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: `Chào mừng ${user.name}!`,
                description: SUCCESS_MESSAGES.LOGIN,
                variant: 'success',
            });

            router.push(ROUTES.DASHBOARD);
        } catch (error) {
            toast({
                title: 'Lỗi đăng nhập',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        } finally {
            setQuickLoginLoading(false);
        }
    };

    // Wrapper function to convert useForm handleChange to expected format
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        form.handleChange(name as keyof LoginFormData, finalValue);
    };

    return {
        // Map useForm properties to expected component props
        loading: form.isSubmitting || quickLoginLoading,
        formData: form.values,
        errors: form.errors,
        handleChange: handleInputChange,
        handleSubmit: form.handleSubmit,
        handleQuickLogin,
    };
}

export function useRegisterForm() {
    const { toast } = useToast();
    const { register } = useAuth();

    const form = useForm<RegisterFormData>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
        schema: registerSchema,
        onSubmit: async (values) => {
            try {
                await register(values.email, values.password);
                toast({
                    title: SUCCESS_MESSAGES.REGISTER,
                    description: 'Tài khoản đã được tạo thành công',
                    variant: 'success',
                });
            } catch (error) {
                let errorMessage: string = ERROR_MESSAGES.REGISTER_FAILED;

                if (isApiError(error) && error.response?.status === 409) {
                    errorMessage = ERROR_MESSAGES.EMAIL_EXISTS;
                } else {
                    errorMessage = getErrorMessage(error);
                }

                toast({
                    title: 'Lỗi đăng ký',
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
        },
    });

    // Wrapper function to convert useForm handleChange to expected format
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        form.handleChange(name as keyof RegisterFormData, finalValue);
    };

    return {
        // Map useForm properties to expected component props
        loading: form.isSubmitting,
        formData: form.values,
        errors: form.errors,
        handleChange: handleInputChange,
        handleSubmit: form.handleSubmit,
    };
}
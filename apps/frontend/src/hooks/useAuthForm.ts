"use client"

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages';
import { isApiError, getErrorMessage } from '@/types/api';
import { MockUser } from '@/data/mock-users';

export function useLoginForm() {
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

            // Sử dụng email và password mặc định cho mock users
            const mockPassword = 'password123'; // Password cho tất cả mock users

            // Thử đăng nhập với backend
            try {
                await login(user.email, mockPassword);
                toast({
                    title: `Chào mừng ${user.name}!`,
                    description: SUCCESS_MESSAGES.LOGIN,
                    variant: 'success',
                });
            } catch {
                // Nếu user chưa tồn tại, tự động đăng ký
                console.log('User not found, auto-registering...');
                try {
                    await register(user.email, mockPassword);
                    await login(user.email, mockPassword);
                    toast({
                        title: `Tài khoản đã được tạo!`,
                        description: `Chào mừng ${user.name}!`,
                        variant: 'success',
                    });
                } catch (registerError) {
                    throw registerError;
                }
            }
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

    // Import register function from useAuth
    const { register } = useAuth();

    // Wrapper function to convert useForm handleChange to expected format
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        form.handleChange(name as keyof LoginFormData, finalValue);
    };

    return {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        form.handleChange(name as keyof RegisterFormData, finalValue);
    };

    return {
        loading: form.isSubmitting,
        formData: form.values,
        errors: form.errors,
        handleChange: handleInputChange,
        handleSubmit: form.handleSubmit,
    };
}
import { useState, useCallback } from 'react';
import { ZodSchema } from 'zod';

interface UseFormOptions<T> {
    initialValues: T;
    schema?: ZodSchema<T>;
    onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    schema,
    onSubmit,
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (name: keyof T, value: any) => {
            setValues((prev) => ({ ...prev, [name]: value }));
            // Clear error when user types
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
        },
        [errors]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value, type } = e.target;
            const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
            handleChange(name as keyof T, finalValue);
        },
        [handleChange]
    );

    const validate = useCallback((): boolean => {
        if (!schema) return true;

        try {
            schema.parse(values);
            setErrors({});
            return true;
        } catch (error: any) {
            if (error.errors) {
                const fieldErrors: Partial<Record<keyof T, string>> = {};
                error.errors.forEach((err: any) => {
                    if (err.path && err.path.length > 0) {
                        fieldErrors[err.path[0] as keyof T] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    }, [schema, values]);

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();

            if (!validate()) return;

            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } finally {
                setIsSubmitting(false);
            }
        },
        [validate, onSubmit, values]
    );

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleInputChange,
        handleSubmit,
        reset,
        setValues,
        setErrors,
    };
}
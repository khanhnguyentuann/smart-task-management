import { useState, useCallback } from 'react';
import { ZodType, ZodError } from 'zod';

interface UseFormOptions<T> {
    initialValues: T;
    schema?: ZodType<T>;
    onSubmit: (values: T) => void | Promise<void>;
    validateOnChange?: boolean;
}

export function useForm<T extends Record<string, unknown>>({
    initialValues,
    schema,
    onSubmit,
    validateOnChange = true,
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const validateField = useCallback(
        (name: keyof T, value: T[keyof T], allValues?: T): string | undefined => {
            if (!schema) return undefined;

            try {
                const testValues = allValues || { ...values, [name]: value };
                schema.parse(testValues);
                return undefined;
            } catch (error) {
                if (error instanceof ZodError) {
                    const fieldError = error.issues.find((err) =>
                        err.path && err.path[0] === name
                    );
                    return fieldError?.message;
                }
                return undefined;
            }
        },
        [schema, values]
    );

    const validateAll = useCallback((): boolean => {
        if (!schema) return true;

        try {
            schema.parse(values);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Partial<Record<keyof T, string>> = {};
                error.issues.forEach((err) => {
                    if (err.path && err.path.length > 0) {
                        const fieldName = err.path[0] as keyof T;
                        fieldErrors[fieldName] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    }, [schema, values]);

    const handleChange = useCallback(
        (name: keyof T, value: T[keyof T]) => {
            const newValues = { ...values, [name]: value };
            setValues(newValues);

            // Mark field as touched
            setTouched(prev => ({ ...prev, [name]: true }));

            // Real-time validation for touched fields
            if (validateOnChange && touched[name]) {
                const fieldError = validateField(name, value, newValues);
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldError
                }));
            }

            // Special case for confirmPassword - validate immediately when password changes
            if (name === 'password' && 'confirmPassword' in newValues) {
                const confirmPasswordValue = newValues.confirmPassword as T[keyof T];
                const confirmPasswordError = validateField('confirmPassword' as keyof T, confirmPasswordValue, newValues);
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: confirmPasswordError
                }));
            }
        },
        [values, validateOnChange, touched, validateField]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value, type } = e.target;
            const target = e.target as HTMLInputElement;
            const finalValue = type === 'checkbox' ? target.checked : value;
            handleChange(name as keyof T, finalValue as T[keyof T]);
        },
        [handleChange]
    );

    const handleBlur = useCallback(
        (name: keyof T) => {
            setTouched(prev => ({ ...prev, [name]: true }));

            // Validate field on blur
            if (schema) {
                const fieldError = validateField(name, values[name]);
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldError
                }));
            }
        },
        [validateField, values, schema]
    );

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();

            // Mark all fields as touched
            const allTouched = Object.keys(values).reduce((acc, key) => {
                acc[key as keyof T] = true;
                return acc;
            }, {} as Partial<Record<keyof T, boolean>>);
            setTouched(allTouched);

            if (!validateAll()) {
                return;
            }

            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } finally {
                setIsSubmitting(false);
            }
        },
        [validateAll, onSubmit, values]
    );

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        touched,
        handleChange,
        handleInputChange,
        handleBlur,
        handleSubmit,
        reset,
        setValues,
        setErrors,
        validateField,
        validateAll,
    };
}
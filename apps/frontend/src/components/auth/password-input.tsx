"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
    id: string
    name: string
    label: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    required?: boolean
}

export function PasswordInput({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="pl-10 pr-10"
                    required={required}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
    )
}
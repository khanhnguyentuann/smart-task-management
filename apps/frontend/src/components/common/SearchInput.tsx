"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchInputProps {
    placeholder?: string
    onSearch: (query: string) => void
    debounceMs?: number
    className?: string
}

export function SearchInput({ 
    placeholder = "Tìm kiếm...", 
    onSearch, 
    debounceMs = 500,
    className = ""
}: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

    useEffect(() => {
        onSearch(debouncedSearchTerm)
    }, [debouncedSearchTerm, onSearch])

    const handleClear = () => {
        setSearchTerm('')
    }

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
            />
            {searchTerm && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={handleClear}
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
} 
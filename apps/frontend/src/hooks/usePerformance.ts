import React, { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Custom hook for performance optimizations
 */
export function usePerformance() {
    const frameRef = useRef<number>()
    const timeoutRef = useRef<NodeJS.Timeout>()

    // Debounced function to avoid excessive calls
    const debounce = useCallback(<T extends (...args: unknown[]) => void>(
        func: T,
        delay: number
    ) => {
        return (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => func(...args), delay)
        }
    }, [])

    // Throttled function to limit execution frequency
    const throttle = useCallback(<T extends (...args: unknown[]) => void>(
        func: T,
        delay: number
    ) => {
        let lastCall = 0
        return (...args: Parameters<T>) => {
            const now = Date.now()
            if (now - lastCall >= delay) {
                lastCall = now
                func(...args)
            }
        }
    }, [])

    // RAF (RequestAnimationFrame) wrapper for smooth animations
    const raf = useCallback((callback: () => void) => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current)
        }
        frameRef.current = requestAnimationFrame(callback)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return {
        debounce,
        throttle,
        raf,
    }
}



/**
 * Hook for lazy loading components
 */
export function useLazyLoad<T>(
    factory: () => Promise<{ default: T }>,
    deps: React.DependencyList = []
) {
    const [Component, setComponent] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        factory()
            .then((module) => {
                setComponent(() => module.default)
            })
            .catch((error) => {
                console.error('Failed to load component:', error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [factory, deps])

    return { Component, loading }
} 
import React from 'react'

/**
 * Higher-order component to memoize components and prevent unnecessary re-renders
 * @param Component - The component to memoize
 * @param propsAreEqual - Optional custom comparison function
 * @returns Memoized component
 */
export function withMemo<T extends React.ComponentType<any>>(
    Component: T,
    propsAreEqual?: (prevProps: Readonly<React.ComponentProps<T>>, nextProps: Readonly<React.ComponentProps<T>>) => boolean
): React.MemoExoticComponent<T> {
    return React.memo(Component, propsAreEqual)
}

/**
 * Hook to create a stable callback that only changes when dependencies change
 * @param callback - The callback function
 * @param dependencies - Array of dependencies
 * @returns Stable callback
 */
export function useStableCallback<T extends (...args: any[]) => any>(
    callback: T,
    dependencies: React.DependencyList
): T {
    return React.useCallback(callback, dependencies)
}

/**
 * Hook to create a stable value that only changes when dependencies change
 * @param factory - Function that creates the value
 * @param dependencies - Array of dependencies
 * @returns Stable value
 */
export function useStableValue<T>(
    factory: () => T,
    dependencies: React.DependencyList
): T {
    return React.useMemo(factory, dependencies)
}

/**
 * Component that only re-renders when its props actually change
 * Useful for expensive components that receive stable props
 */
export const StableComponent = React.memo(function StableComponent<T extends Record<string, any>>({
    children,
    ...props
}: T & { children: React.ReactNode }) {
    return <>{children}</>
})

/**
 * Hook to debounce a value
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * Hook to throttle a callback
 * @param callback - The callback to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const lastRun = React.useRef(Date.now())

    return React.useCallback(
        (...args: Parameters<T>) => {
            if (Date.now() - lastRun.current >= delay) {
                callback(...args)
                lastRun.current = Date.now()
            }
        },
        [callback, delay]
    ) as T
}

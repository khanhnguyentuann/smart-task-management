import { useLocalStorage } from './useLocalStorage'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')

    const toggleTheme = () => {
        setTheme(current => {
            if (current === 'light') return 'dark'
            if (current === 'dark') return 'system'
            return 'light'
        })
    }

    const setLightTheme = () => setTheme('light')
    const setDarkTheme = () => setTheme('dark')
    const setSystemTheme = () => setTheme('system')

    return {
        theme,
        setTheme,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        setSystemTheme,
    }
} 
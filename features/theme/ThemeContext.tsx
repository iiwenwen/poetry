import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'storybook' | 'ticket'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('storybook')

    // 从 localStorage 读取主题
    useEffect(() => {
        const savedTheme = localStorage.getItem('poetry-theme') as Theme
        if (savedTheme === 'storybook' || savedTheme === 'ticket') {
            setThemeState(savedTheme)
        }
    }, [])

    // 保存主题到 localStorage
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('poetry-theme', newTheme)
    }

    const toggleTheme = () => {
        setTheme(theme === 'storybook' ? 'ticket' : 'storybook')
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

import React from 'react'
import { useTheme } from '@/features/theme'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-card shadow-lg hover:shadow-xl transition-all duration-300 border border-border/30 group"
            aria-label="切换主题"
            title={theme === 'storybook' ? '切换到票根样式' : '切换到绘本样式'}
        >
            {theme === 'storybook' ? (
                // 票根图标
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform group-hover:scale-110"
                >
                    <rect x="4" y="6" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
                    <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="6" cy="8" r="1" fill="currentColor" />
                    <circle cx="18" cy="8" r="1" fill="currentColor" />
                    <path d="M20 12 L21 13 L20 14 L21 15 L20 16 L21 17 L20 18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                // 绘本图标
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform group-hover:scale-110"
                >
                    <path d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M8 10C8 10 9 11 10 11C11 11 12 10 12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 10C12 10 13 11 14 11C15 11 16 10 16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="9" cy="9" r="1" fill="currentColor" />
                    <circle cx="15" cy="9" r="1" fill="currentColor" />
                    <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            )}

            {/* 提示文字 */}
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-card px-3 py-1 rounded-lg shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border/30">
                {theme === 'storybook' ? '票根样式' : '绘本样式'}
            </span>
        </button>
    )
}

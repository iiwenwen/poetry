/**
 * 诗歌 Context - 简化版
 * 只负责管理标签状态,数据获取由 usePoetryData hook 处理
 */

import React, { createContext, useState } from 'react'
import { TAGS } from '@/lib/config'
import type { TabType } from '@/types'

export interface PoetryContextType {
    activeTab: TabType
    setActiveTab: (tab: TabType) => void
}

export const PoetryContext = createContext<PoetryContextType | undefined>(undefined)

export function PoetryProvider({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState<TabType>(TAGS.HAIKU)

    return (
        <PoetryContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </PoetryContext.Provider>
    )
}

/**
 * 使用 PoetryContext 的 Hook
 */
export function usePoetryContext() {
    const context = React.useContext(PoetryContext)
    if (!context) {
        throw new Error('usePoetryContext must be used within PoetryProvider')
    }
    return context
}

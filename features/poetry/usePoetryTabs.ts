/**
 * 诗歌标签管理 Hook
 * 管理当前激活的标签状态
 */

import { useState } from 'react'
import { TAGS } from '@/lib/config'
import type { TabType } from '@/types'

/**
 * 诗歌标签管理 Hook
 * @returns 当前标签和设置标签的函数
 */
export function usePoetryTabs() {
    const [activeTab, setActiveTab] = useState<TabType>(TAGS.HAIKU)

    return {
        activeTab,
        setActiveTab
    }
}

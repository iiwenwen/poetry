// API 响应类型
export interface MemosResponse {
  memos: Memo[]
  next_page_token?: string
}

export interface Memo {
  name: string
  state: string
  creator: string
  createTime: string  // ISO 8601 format
  updateTime: string  // ISO 8601 format
  displayTime: string  // ISO 8601 format
  content: string
  visibility: string
  tags: string[]
  pinned: boolean
  // ... other optional fields
}

// Tab 类型（使用联合类型而不是 typeof TAGS）
export type TabType = '来写首俳句吧' | '来写首诗吧'

// 组件 Props 类型
export interface CardContentProps {
  content: string
  date: string | number | Date
}

export interface CardImageProps {
  index?: number
  // 目前 CardImage 没有特殊 props，预留扩展
}

export interface TabsProps {
  // 目前 Tabs 没有特殊 props，预留扩展
}

// SWR 钩子返回类型
export interface UseSWRInfiniteResponse<T> {
  data: T[] | undefined
  error: Error | undefined
  size: number
  setSize: (size: number) => void | Promise<void>
  isValidating: boolean
  isLoading: boolean
  isLoadingMore: boolean
  isReachingEnd: boolean
}

// Tab 数据上下文类型
export interface TabDataContextType {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

// API 配置类型
export interface APIConfig {
  BASE_URL: string
  ENDPOINTS: {
    MEMOS: string
  }
  SWR: {
    dedupingInterval: number
    refreshInterval: number
    revalidateOnFocus: boolean
    revalidateOnReconnect: boolean
    errorRetryCount: number
    errorRetryInterval: number
  }
}

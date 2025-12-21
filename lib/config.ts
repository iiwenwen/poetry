import type { APIConfig } from '../types'

// API 配置
export const API_CONFIG: APIConfig = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://memos.syaoran.me/api/v1",
  ENDPOINTS: {
    MEMOS: "/memos"
  },
  // SWR 缓存配置
  SWR: {
    dedupingInterval: 5000, // 5秒内相同请求去重
    refreshInterval: 0, // 禁用自动刷新
    revalidateOnFocus: false, // 页面聚焦时不重新验证
    revalidateOnReconnect: true, // 网络重连时重新验证
    errorRetryCount: 3, // 错误重试次数
    errorRetryInterval: 5000, // 错误重试间隔（毫秒）
  }
}

// 构建 API URL
export const buildApiUrl = (endpoint: string, params: Record<string, string | number> = {}): string => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`)

  // 添加查询参数
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  return url.toString()
}

// 提取的标签常量
export const TAGS = {
  HAIKU: '来写首俳句吧',
  POEM: '来写首诗吧'
} as const

export type TagType = typeof TAGS[keyof typeof TAGS]

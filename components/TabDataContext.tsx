import useSWR from 'swr'
import useSWRInfinite from "swr/infinite"
import React, { createContext, useState, useCallback } from 'react'
import { API_CONFIG, buildApiUrl, TAGS } from '../lib/config'
import type { TabDataContextType, TabType } from '../types'

const TabDataContext = createContext<TabDataContextType | undefined>(undefined)

export function TabDataProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>(TAGS.HAIKU)

  return (
    <TabDataContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabDataContext.Provider>
  )
}

// 自定义错误类型
class HTTPError extends Error {
  status: number
  url: string
  constructor(status: number, message: string, url: string) {
    super(message)
    this.name = 'HTTPError'
    this.status = status
    this.url = url
  }
}

// 网络错误类型
class NetworkError extends Error {
  url: string
  constructor(message: string, url: string) {
    super(message)
    this.name = 'NetworkError'
    this.url = url
  }
}

// 增强的 fetcher 函数，包含重试机制
const fetcher = async (url: string, retries: number = 3): Promise<any> => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // 添加超时控制
      signal: AbortSignal.timeout(10000) // 10秒超时
    })

    if (!res.ok) {
      const errorData = await res.text()
      console.error(`HTTP ${res.status} error for ${url}:`, errorData)
      throw new HTTPError(res.status, `HTTP error! status: ${res.status}`, url)
    }

    const data = await res.json()

    // 验证响应数据格式
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid response format from ${url}`)
    }

    // 验证必需的字段
    if (!Array.isArray(data.memos)) {
      console.warn('Response missing memos array:', data)
      // 如果响应没有memos字段，尝试修复（某些API可能直接返回数组）
      let responseData = data
      if (Array.isArray(data)) {
        responseData = { memos: data, nextPageToken: undefined }
      } else {
        throw new Error(`Invalid memos response format from ${url}`)
      }
      console.log(`Successfully fetched ${responseData.memos.length} memos from ${url}`)
      return responseData
    }

    console.log(`Successfully fetched ${data.memos.length} memos from ${url}`)
    return data

  } catch (error) {
    // 如果是超时或网络错误，并且还有重试次数，则重试
    if (retries > 0 && (error instanceof Error && (error.name === 'AbortError' || error.name === 'TypeError' || error.name === 'NetworkError'))) {
      console.log(`Retrying request (${retries} attempts left): ${url}`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries))) // 指数退避
      return fetcher(url, retries - 1)
    }

    // 如果是HTTP错误且状态码是5xx，且还有重试次数，则重试
    if (error instanceof HTTPError && error.status >= 500 && retries > 0) {
      console.log(`Retrying server error (${retries} attempts left): ${error.url}`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries))) // 指数退避
      return fetcher(url, retries - 1)
    }

    console.error(`Fetch failed for ${url} after ${4 - retries} attempts:`, error)
    throw error
  }
}

import { sanitizeTag } from '../lib/utils'

// API请求验证
const validateApiRequest = (url: string): boolean => {
  try {
    const urlObj = new URL(url)

    // 验证必需的参数
    const hasPageSize = urlObj.searchParams.has('pageSize')
    if (!hasPageSize) {
      console.error('Missing required parameter: pageSize')
      return false
    }

    // 验证pageSize值
    const pageSize = urlObj.searchParams.get('pageSize')
    if (pageSize && (isNaN(Number(pageSize)) || Number(pageSize) <= 0 || Number(pageSize) > 1000)) {
      console.error('Invalid pageSize value:', pageSize)
      return false
    }

    // 验证filter语法（如果存在）
    const filter = urlObj.searchParams.get('filter')
    if (filter && !filter.includes('tag') && !filter.includes('content') && !filter.includes('name')) {
      console.warn('Filter might be invalid:', filter)
    }

    return true
  } catch (error) {
    console.error('Invalid URL:', url, error)
    return false
  }
}

// 获取缓存 key 的函数
const getKey = (pageIndex: number, previousPageData: any, tag: string) => {
  if (previousPageData && !previousPageData.nextPageToken) {
    return null
  }

  const sanitizedTag = sanitizeTag(tag)

  const params: Record<string, string> = {
    // 使用正确的 Memos API filter 语法
    filter: `tag in ["${sanitizedTag}"]`,
    pageSize: '10'
  }

  if (pageIndex > 0 && previousPageData?.nextPageToken) {
    params.pageToken = previousPageData.nextPageToken
  }

  const url = buildApiUrl(API_CONFIG.ENDPOINTS.MEMOS, params)

  // 验证生成的URL
  if (!validateApiRequest(url)) {
    console.error('API request validation failed for URL:', url)
    return null
  }

  return url
}

// Fallback strategies for different filter types
const FALLBACK_FILTERS = [
  'tags contains',
  'content contains',
  'name contains'
]

export function getDate(tag: string) {
  // 使用 useCallback 稳定 getKey 函数引用
  const getKeyCallback = React.useCallback((pageIndex: number, previousPageData: any) => {
    return getKey(pageIndex, previousPageData, tag)
  }, [tag])

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading
  } = useSWRInfinite(
    getKeyCallback,
    (url: string) => fetcher(url),
    {
      // 使用配置中的 SWR 选项
      ...API_CONFIG.SWR,
      // 禁用 SWR 内置重试，使用我们自定义的重试机制
      shouldRetryOnError: false
    }
  )

  // 修复加载状态判断逻辑
  // isValidating 表示正在验证/重新验证数据
  // 只有在正在验证且最后一页数据未定义时才显示加载中
  const isLoadingMore = isValidating && (!data || typeof data[size - 1] === "undefined")

  // 改进 isReachingEnd 判断:检查 nextPageToken 是否为 undefined, null 或空字符串
  const lastPage = data && data.length > 0 ? data[data.length - 1] : null
  const isReachingEnd = lastPage && !lastPage.nextPageToken

  const tabData = data ? data.flatMap((page) => page.memos) : []

  return {
    tabData,
    error,
    size,
    setSize,
    isLoadingMore,
    isReachingEnd,
    isValidating
  }
}

export { TabDataContext }

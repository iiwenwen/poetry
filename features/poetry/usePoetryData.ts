/**
 * 诗歌数据获取 Hook
 * 从 TabDataContext 中抽离出来,实现数据层和 UI 层分离
 */

import useSWRInfinite from 'swr/infinite'
import { API_CONFIG, buildApiUrl } from '@/lib/config'
import { sanitizeTag } from '@/lib/utils'

// 增强的 fetcher 函数,包含重试机制
const fetcher = async (url: string, retries: number = 3): Promise<any> => {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(10000) // 10秒超时
        })

        if (!res.ok) {
            const errorData = await res.text()
            console.error(`HTTP ${res.status} error for ${url}:`, errorData)
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()

        if (!data || typeof data !== 'object') {
            throw new Error(`Invalid response format from ${url}`)
        }

        if (!Array.isArray(data.memos)) {
            console.warn('Response missing memos array:', data)
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
        if (retries > 0 && (error instanceof Error && (error.name === 'AbortError' || error.name === 'TypeError' || error.name === 'NetworkError'))) {
            console.log(`Retrying request (${retries} attempts left): ${url}`)
            await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)))
            return fetcher(url, retries - 1)
        }

        console.error(`Fetch failed for ${url} after ${4 - retries} attempts:`, error)
        throw error
    }
}

// 获取缓存 key 的函数
const getKey = (pageIndex: number, previousPageData: any, tag: string) => {
    if (previousPageData && !previousPageData.nextPageToken) {
        return null
    }

    const sanitizedTag = sanitizeTag(tag)

    const params: Record<string, string> = {
        filter: `tag in ["${sanitizedTag}"]`,
        pageSize: '10'
    }

    if (pageIndex > 0 && previousPageData?.nextPageToken) {
        params.pageToken = previousPageData.nextPageToken
    }

    return buildApiUrl(API_CONFIG.ENDPOINTS.MEMOS, params)
}

/**
 * 诗歌数据获取 Hook
 * @param tag - 标签名称
 * @returns 数据、错误、加载状态等
 */
export function usePoetryData(tag: string) {
    const {
        data,
        error,
        size,
        setSize,
        isValidating,
        isLoading
    } = useSWRInfinite(
        (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, tag),
        (url: string) => fetcher(url),
        {
            ...API_CONFIG.SWR,
            shouldRetryOnError: false
        }
    )

    const isLoadingMore = isValidating && (!data || typeof data[size - 1] === "undefined")
    const lastPage = data && data.length > 0 ? data[data.length - 1] : null
    const isReachingEnd = lastPage && !lastPage.nextPageToken
    const tabData = data ? data.flatMap((page) => page.memos) : []

    return {
        data: tabData,
        error,
        size,
        setSize,
        isLoadingMore,
        isReachingEnd,
        isValidating
    }
}

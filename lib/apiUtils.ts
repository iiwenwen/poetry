import type { TabType } from '../types'

// 标签验证和清理
export const sanitizeInput = (input: string): string => {
  // 移除或转义可能导致问题的字符
  return input
    .replace(/["'<>]/g, '') // 移除引号和尖括号
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim()
}

// API 请求验证
export const validateApiRequest = (url: string, params: Record<string, any>): { valid: boolean; error?: string } => {
  // 验证URL格式
  try {
    new URL(url)
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }

  // 验证必需参数
  if (!params.pageSize) {
    return { valid: false, error: 'Missing required parameter: pageSize' }
  }

  // 验证 pageSize（根据官方文档：最大1000）
  const pageSize = Number(params.pageSize)
  if (isNaN(pageSize) || pageSize <= 0 || pageSize > 1000) {
    return { valid: false, error: 'Invalid pageSize (must be 1-1000)' }
  }

  // 验证 filter 格式（如果存在）
  if (params.filter) {
    const filter = params.filter
    // 检查filter是否包含基本的关键字
    const validFilterKeywords = ['tag', 'content', 'name', 'creator_id', 'visibility', 'state']
    const hasValidKeyword = validFilterKeywords.some(keyword => filter.includes(keyword))

    if (!hasValidKeyword) {
      console.warn('Filter might be invalid, missing recognized keywords:', filter)
    }

    // 检查引号匹配
    const quotes = (filter.match(/"/g) || []).length
    if (quotes % 2 !== 0) {
      return { valid: false, error: 'Unmatched quotes in filter parameter' }
    }
  }

  // 验证 pageToken（如果存在）
  if (params.pageToken && typeof params.pageToken !== 'string') {
    return { valid: false, error: 'pageToken must be a string' }
  }

  // 验证 state（如果存在）
  if (params.state) {
    const validStates = ['STATE_UNSPECIFIED', 'NORMAL', 'ARCHIVED']
    if (!validStates.includes(params.state)) {
      return { valid: false, error: `Invalid state. Must be one of: ${validStates.join(', ')}` }
    }
  }

  return { valid: true }
}

// API 响应验证
export const validateApiResponse = (response: any): { valid: boolean; error?: string; data?: any } => {
  // 检查响应是否是对象
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Response is not an object' }
  }

  // 检查是否有 memos 字段
  if (!Array.isArray(response.memos)) {
    // 如果直接是数组，包装成标准格式
    if (Array.isArray(response)) {
      return { valid: true, data: { memos: response, next_page_token: undefined } }
    }
    return { valid: false, error: 'Response missing memos array' }
  }

  // 验证 memos 数组中的每个项目
  for (const memo of response.memos) {
    if (!memo || typeof memo !== 'object') {
      return { valid: false, error: 'Invalid memo object in array' }
    }
    if (!memo.id || !memo.content) {
      return { valid: false, error: 'Memo missing required fields (id, content)' }
    }
  }

  // 验证 next_page_token（如果存在）
  if (response.next_page_token && typeof response.next_page_token !== 'string') {
    return { valid: false, error: 'next_page_token must be a string' }
  }

  return { valid: true, data: response }
}

// 尝试不同的 API 请求策略
export const API_STRATEGIES = [
  // 策略 1: 使用 tag in 语法（正确语法）
  (tag: TabType, pageSize: number, pageToken?: string) => {
    const sanitizedTag = sanitizeInput(tag)
    const params = {
      filter: `tag in ["${sanitizedTag}"]`,
      pageSize: pageSize.toString()  // 修正：pageSize
    }

    const validation = validateApiRequest('/api/v1/memos', params)
    if (!validation.valid) {
      throw new Error(`Strategy validation failed: ${validation.error}`)
    }

    const searchParams = new URLSearchParams(params)
    if (pageToken) searchParams.append('pageToken', pageToken)  // 修正：pageToken
    return { url: `/api/v1/memos?${searchParams.toString()}`, strategy: 'tag in', params }
  },

  // 策略 2: 使用 content 字段搜索
  (tag: TabType, pageSize: number, pageToken?: string) => {
    const sanitizedTag = sanitizeInput(tag)
    const params = {
      filter: `content == "${sanitizedTag}"`,
      pageSize: pageSize.toString()  // 修正：pageSize
    }

    const validation = validateApiRequest('/api/v1/memos', params)
    if (!validation.valid) {
      throw new Error(`Strategy validation failed: ${validation.error}`)
    }

    const searchParams = new URLSearchParams(params)
    if (pageToken) searchParams.append('pageToken', pageToken)  // 修正：pageToken
    return { url: `/api/v1/memos?${searchParams.toString()}`, strategy: 'content ==', params }
  },

  // 策略 3: 不使用 filter，获取所有数据（回退方案）
  (tag: TabType, pageSize: number, pageToken?: string) => {
    const params = {
      pageSize: pageSize.toString()  // 修正：pageSize
    }

    const validation = validateApiRequest('/api/v1/memos', params)
    if (!validation.valid) {
      throw new Error(`Strategy validation failed: ${validation.error}`)
    }

    const searchParams = new URLSearchParams(params)
    if (pageToken) searchParams.append('pageToken', pageToken)  // 修正：pageToken
    return { url: `/api/v1/memos?${searchParams.toString()}`, strategy: 'no filter', params }
  },

  // 策略 4: 使用 name 字段搜索
  (tag: TabType, pageSize: number, pageToken?: string) => {
    const sanitizedTag = sanitizeInput(tag)
    const params = {
      filter: `name == "${sanitizedTag}"`,
      pageSize: pageSize.toString()  // 修正：pageSize
    }

    const validation = validateApiRequest('/api/v1/memos', params)
    if (!validation.valid) {
      throw new Error(`Strategy validation failed: ${validation.error}`)
    }

    const searchParams = new URLSearchParams(params)
    if (pageToken) searchParams.append('pageToken', pageToken)  // 修正：pageToken
    return { url: `/api/v1/memos?${searchParams.toString()}`, strategy: 'name ==', params }
  }
]

// 智能 API URL 生成器
export const generateApiUrl = (
  tag: TabType,
  pageIndex: number,
  previousPageData: any,
  apiBaseUrl: string
): { url: string, strategy: string } | null => {
  const pageSize = 10

  // 如果没有更多数据，返回 null
  if (previousPageData && !previousPageData.next_page_token) {
    return null
  }

  // 如果是第一页或指定了特定策略，尝试不同的策略
  const strategyIndex = pageIndex % API_STRATEGIES.length
  const strategy = API_STRATEGIES[strategyIndex]

  try {
    const result = strategy(tag, pageSize, previousPageData?.next_page_token)

    // 验证生成的 URL
    const validation = validateApiRequest(result.url, result.params)
    if (!validation.valid) {
      console.error('Generated URL validation failed:', validation.error)
      return null
    }

    // 构建完整 URL
    const fullUrl = `${apiBaseUrl}${result.url}`

    // 最终验证完整 URL
    try {
      new URL(fullUrl)
    } catch (error) {
      console.error('Invalid full URL:', fullUrl, error)
      return null
    }

    return { url: fullUrl, strategy: result.strategy }
  } catch (error) {
    console.error(`Strategy ${strategyIndex} failed:`, error)
    return null
  }
}

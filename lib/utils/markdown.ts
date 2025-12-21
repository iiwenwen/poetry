/**
 * Markdown 处理工具函数
 */

import { marked } from 'marked'

// 配置 marked(只在模块加载时执行一次)
marked.setOptions({
    breaks: true,
    gfm: true,
})

/**
 * 标签匹配模式
 */
const TAG_PATTERNS = [
    /#来写首俳句吧( \d+\/\d+)?/g,
    /#来写首诗吧( \d+\/\d+)?/g,
    /Day \d+年\d+月\d+日 \d+:\d+:\d+/g
]

/**
 * 移除内容中的标签
 * @param content - 原始内容
 * @returns 移除标签后的内容
 */
export function removeHashtags(content: string): string {
    let result = content
    for (const pattern of TAG_PATTERNS) {
        result = result.replace(pattern, '')
    }
    return result.trim()
}

/**
 * 解析 Markdown 为 HTML
 * @param content - Markdown 内容
 * @returns HTML 字符串
 */
export function parseMarkdown(content: string): string {
    return marked.parse(content) as string
}

/**
 * 处理并解析 Markdown 内容
 * @param content - 原始 Markdown 内容
 * @returns 处理后的 HTML 字符串
 */
export function processAndParseMarkdown(content: string): string {
    const cleaned = removeHashtags(content)
    return parseMarkdown(cleaned)
}

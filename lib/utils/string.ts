/**
 * 字符串处理工具函数
 */

/**
 * 验证和清理标签参数
 * 移除特殊字符,只保留中文字符、字母、数字和基本标点
 * @param tag - 原始标签
 * @returns 清理后的标签
 */
export function sanitizeTag(tag: string): string {
    return tag.replace(/[^\w\s\u4e00-\u9fa5-]/g, '').trim()
}

/**
 * 截断字符串到指定长度
 * @param str - 原始字符串
 * @param maxLength - 最大长度
 * @param suffix - 后缀,默认为 '...'
 * @returns 截断后的字符串
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
    if (str.length <= maxLength) {
        return str
    }
    return str.slice(0, maxLength - suffix.length) + suffix
}

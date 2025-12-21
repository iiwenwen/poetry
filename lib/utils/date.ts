/**
 * 日期处理工具函数
 */

/**
 * 格式化日期为中文格式
 * @param date - ISO 8601 字符串、Unix 时间戳(秒)或 Date 对象
 * @returns 格式化后的日期字符串,如 "2024年12月11日"
 */
export function formatDate(date: number | string | Date): string {
    let newDate: Date

    if (typeof date === 'string') {
        // ISO 8601 格式字符串
        newDate = new Date(date)
    } else if (typeof date === 'number') {
        // Unix 时间戳(秒),需要转换为毫秒
        newDate = new Date(date * 1000)
    } else {
        // 已经是 Date 对象
        newDate = date
    }

    // 检查日期是否有效
    if (isNaN(newDate.getTime())) {
        return '未知日期'
    }

    const year = newDate.getFullYear()
    const month = newDate.getMonth() + 1
    const day = newDate.getDate()

    return `${year}年${month}月${day}日`
}

/**
 * 解析日期字符串或时间戳为 Date 对象
 * @param date - ISO 8601 字符串或 Unix 时间戳(秒)
 * @returns Date 对象
 */
export function parseDate(date: string | number): Date {
    if (typeof date === 'string') {
        return new Date(date)
    }
    return new Date(date * 1000)
}

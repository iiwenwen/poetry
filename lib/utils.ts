import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 导出工具函数模块
export * from './utils/date'
export * from './utils/markdown'
export * from './utils/string'

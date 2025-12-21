import React, { useMemo } from 'react'
import { usePoetryContext } from '@/features/poetry'
import { formatDate, processAndParseMarkdown } from "@/lib/utils"
import type { CardContentProps } from "../types"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from '@/features/theme'


export default React.memo(function CardContent({ content, date }: CardContentProps) {
  const { activeTab } = usePoetryContext()
  const { theme } = useTheme()

  if (!content) {
    return null
  }

  // 使用工具函数处理内容
  const parsedContent = useMemo(() => {
    return processAndParseMarkdown(content)
  }, [content])

  const formattedDate = useMemo(() => {
    return formatDate(date)
  }, [date])

  // 计算内容行数(粗略估计:每50个字符一行)
  const estimatedLines = useMemo(() => {
    // 去除 HTML 标签后计算
    const textContent = content.replace(/<[^>]*>/g, '')
    return Math.ceil(textContent.length / 30)
  }, [content])

  // 只有超过4行才使用两列
  const useColumns = estimatedLines > 4

  // 票根主题使用紧凑样式
  if (theme === 'ticket') {
    return (
      <div style={{ padding: '8px 12px' }}>
        <div
          style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: 'oklch(var(--ticket-text))',
            ...(useColumns && {
              columnCount: 2,
              columnGap: '24px',
              columnRule: '1px dashed oklch(var(--ticket-border))'
            })
          }}
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
        <p style={{
          fontSize: '12px',
          color: 'oklch(var(--ticket-text-light))',
          marginTop: '4px',
        }}>
          创建于 {formattedDate}
        </p>
      </div>
    )
  }

  // 绘本主题使用原有样式
  return (
    <div className="p-8 bg-white/60 backdrop-blur-sm">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-foreground/90">
          {activeTab}
        </CardTitle>
      </CardHeader>
      <div
        className="prose prose-lg prose-stone max-w-none 
                   prose-img:rounded-lg prose-img:shadow-md
                   prose-headings:text-foreground prose-headings:font-bold
                   prose-p:text-foreground/80 prose-p:leading-relaxed
                   prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-primary prose-strong:font-semibold"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
      <p className="text-sm text-muted-foreground mt-8 pt-4 border-t border-border/50">
        创建于 {formattedDate}
      </p>
    </div>
  )
})

import React, { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import CardContent from '@/components/CardContent'
import CardImage from '@/components/CardImage'
import Tabs from '@/components/Tabs'
import ErrorBoundary from '@/components/ErrorBoundary'
import { usePoetryContext } from '@/features/poetry'
import { usePoetryData } from '@/features/poetry'
import { useTheme } from '@/features/theme'

export default function Home() {
  const { activeTab } = usePoetryContext()
  const { data: tabData, isLoadingMore, isReachingEnd, setSize, size } = usePoetryData(activeTab)
  const { theme } = useTheme()


  // 自动加载更多
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!isReachingEnd && !isLoadingMore) {
          setSize(size + 1)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isReachingEnd, isLoadingMore, setSize, size])


  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {tabData && tabData.length > 0 ? (
          tabData.map((item: any, index: number) => (
            <ErrorBoundary key={item.name}>
              {theme === 'ticket' ? (
                // 票根样式 - 长条形布局
                <div
                  className="ticket-card transition-all duration-300 animate-[bounce-in_0.6s_ease-out]"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    backgroundImage: `url(/poetry/${(index % 8) + 1}.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* 背景遮罩层 - 让图片更明显 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'inherit',
                      background: 'linear-gradient(to right, oklch(var(--ticket-overlay) / 0.8), oklch(var(--ticket-overlay) / 0.6), oklch(var(--ticket-overlay) / 0.4))'
                    }}
                  />

                  {/* 左侧副券 */}
                  <div className="ticket-stub relative z-10">
                    <div className="ticket-number">
                      {new Date(item.createTime).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                    </div>
                  </div>

                  {/* 主票区域 */}
                  <div className="ticket-main relative z-10">
                    <div className="ticket-header">
                      <span className="text-xs font-mono text-amber-700">
                        No. {new Date(item.createTime).getTime().toString().slice(-6)}
                      </span>
                      <div className="ticket-stamp">诗</div>
                    </div>
                    <div className="ticket-content">
                      <CardContent content={item.content} date={item.createTime} />
                    </div>
                  </div>
                </div>
              ) : (
                // 绘本样式 - 原有卡片布局
                <Card
                  className="overflow-hidden shadow-md hover:shadow-xl border border-border/30 
                            hover:scale-[1.01] bg-white/90 backdrop-blur-sm transition-all duration-300 
                            animate-[bounce-in_0.6s_ease-out]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardImage index={index} />
                  <CardContent content={item.content} date={item.createTime} />
                </Card>
              )}
            </ErrorBoundary>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isLoadingMore ? '加载中...' : '暂无数据'}
          </div>
        )}

        {/* 只在有数据且正在加载更多时显示 */}
        {tabData && tabData.length > 0 && isLoadingMore && (
          <div className="text-center py-4 text-muted-foreground">
            加载更多...
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

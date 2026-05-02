import { useState, useRef, useEffect } from 'react'
import type { CardImageProps } from '../types'

// 总共有8张优化后的图片
const TOTAL_IMAGES = 8

export default function CardImage(props: CardImageProps) {
  const { index = 0 } = props
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // 根据索引循环选择图片 (1-8)
  const imageNumber = (index % TOTAL_IMAGES) + 1
  const imageUrl = `/poetry/${imageNumber}.webp`

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // 提前50px开始加载
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setHasError(false)
    setShowImage(true)
  }

  const handleError = () => {
    console.error(`图片加载失败: ${imageUrl}`)
    setHasError(true)
  }

  return (
    <div ref={imgRef} className="relative w-full overflow-hidden rounded-t-lg">
      {isInView ? (
        <>
          {/* 骨架屏 - 始终显示直到图片完全加载 */}
          {!showImage && !hasError && (
            <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-muted via-muted/80 to-muted">
              <div className="w-full h-full flex items-center justify-center">
                <div className="space-y-2 w-3/4">
                  <div className="h-2 bg-background/50 rounded-full w-3/4 mx-auto"></div>
                  <div className="h-2 bg-background/50 rounded-full w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          )}

          {/* 错误降级 */}
          {hasError ? (
            <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-storybook-pink/20 to-storybook-blue/20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">🎨</span>
            </div>
          ) : (
            <div className="relative w-full h-32 sm:h-40">
              <img
                className={`w-full h-full object-cover ${showImage ? 'opacity-60' : 'opacity-0'
                  }`}
                src={imageUrl}
                alt={`诗歌配图 ${imageNumber}`}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </>
      ) : (
        // 未进入视口时的占位符
        <div className="w-full h-32 sm:h-40 bg-muted/50" />
      )}
    </div>
  )
}

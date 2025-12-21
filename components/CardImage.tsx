import { useState, useRef, useEffect } from 'react'
import type { CardImageProps } from '../types'

// 总共有8张优化后的图片
const TOTAL_IMAGES = 8

// 预加载图片缓存
const imageCache = new Set<string>()

export default function CardImage(props: CardImageProps) {
  const { index = 0 } = props
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // 根据索引循环选择图片 (1-8)
  const imageNumber = (index % TOTAL_IMAGES) + 1
  const imageUrl = `/poetry/${imageNumber}.webp`

  // 预加载前3张图片
  useEffect(() => {
    if (index < 3) {
      const img = new Image()
      img.src = imageUrl
      img.onload = () => {
        imageCache.add(imageUrl)
      }
    }
  }, [imageUrl, index])

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
    setIsLoaded(true)
    setHasError(false)
    // 延迟显示,创建淡入效果
    setTimeout(() => {
      setShowImage(true)
    }, 50)
  }

  const handleError = () => {
    console.error(`图片加载失败: ${imageUrl}`)
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <div ref={imgRef} className="relative w-full overflow-hidden rounded-t-lg">
      {isInView ? (
        <>
          {/* 骨架屏 - 始终显示直到图片完全加载 */}
          {!showImage && !hasError && (
            <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse">
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
                className={`w-full h-full object-cover transition-all duration-500 ${showImage ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
                  }`}
                src={imageUrl}
                alt={`诗歌配图 ${imageNumber}`}
                onLoad={handleLoad}
                onError={handleError}
                loading={index < 2 ? 'eager' : 'lazy'} // 前2张立即加载
                style={{
                  display: isLoaded ? 'block' : 'none',
                }}
              />
              {/* 渐变遮罩 - 让图片更柔和 */}
              {showImage && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/30 pointer-events-none" />
              )}
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

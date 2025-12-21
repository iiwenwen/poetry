import React from 'react'

// 生成固定的伪随机数序列,避免 hydration 错误
const seededRandom = (seed: number) => {
    const a = 1103515245
    const c = 12345
    const m = 2147483648
    const x = (a * seed + c) % m
    return x / m
}

// 预生成星星位置
const starPositions = Array.from({ length: 20 }, (_, i) => {
    const seed = i * 1000
    return {
        top: Math.round((10 + seededRandom(seed) * 80) * 100) / 100,
        left: Math.round((5 + seededRandom(seed + 1) * 90) * 100) / 100,
        delay: Math.round(seededRandom(seed + 2) * 3 * 100) / 100,
        duration: Math.round((2 + seededRandom(seed + 3) * 2) * 100) / 100,
        hue: Math.round(seededRandom(seed + 4) * 360),
    }
})

// 预生成花朵位置
const flowerPositions = Array.from({ length: 8 }, (_, i) => {
    const seed = i * 2000
    const centerHue = i * 45
    const petals = Array.from({ length: 5 }, (_, j) => ({
        cx: Math.round((10 + 5 * Math.cos((j * 2 * Math.PI) / 5)) * 1000) / 1000,
        cy: Math.round((10 + 5 * Math.sin((j * 2 * Math.PI) / 5)) * 1000) / 1000,
    }))
    return {
        bottom: Math.round((5 + seededRandom(seed) * 15) * 100) / 100,
        left: 10 + i * 10,
        hue: centerHue,
        petals,
    }
})

import { useTheme } from '@/features/theme'

export default function BackgroundDecorations() {
    const { theme } = useTheme()
    // 两个主题都使用浅色模式装饰
    const isDark = false

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* 太阳/月亮 */}
            <div className="absolute top-[3%] right-[8%]">
                {isDark ? (
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <path
                            d="M40 10 A25 25 0 1 0 40 70 A18 18 0 1 1 40 10"
                            fill="oklch(0.90 0.05 90)"
                            opacity="0.8"
                        />
                        <circle cx="35" cy="30" r="3" fill="oklch(0.80 0.03 90)" opacity="0.5" />
                        <circle cx="45" cy="45" r="4" fill="oklch(0.80 0.03 90)" opacity="0.4" />
                        <circle cx="30" cy="50" r="2" fill="oklch(0.80 0.03 90)" opacity="0.5" />
                    </svg>
                ) : (
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="20" fill="hsl(50, 90%, 65%)" opacity="0.7" />
                        {[...Array(8)].map((_, i) => (
                            <line
                                key={i}
                                x1="40"
                                y1="40"
                                x2={40 + 30 * Math.cos((i * Math.PI) / 4)}
                                y2={40 + 30 * Math.sin((i * Math.PI) / 4)}
                                stroke="hsl(50, 90%, 65%)"
                                strokeWidth="3"
                                opacity="0.6"
                            />
                        ))}
                    </svg>
                )}
            </div>

            {/* 深色模式下的星星 */}
            {isDark && Array.from({ length: 30 }, (_, i) => {
                const seed = i * 500 + 100
                return (
                    <div
                        key={`night-star-${i}`}
                        className="absolute animate-pulse"
                        style={{
                            top: `${5 + seededRandom(seed) * 90}%`,
                            left: `${5 + seededRandom(seed + 1) * 90}%`,
                            animationDelay: `${seededRandom(seed + 2) * 3}s`,
                            animationDuration: `${1.5 + seededRandom(seed + 3) * 2}s`
                        }}
                    >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <circle cx="4" cy="4" r="1.5" fill="white" opacity="0.8" />
                        </svg>
                    </div>
                )
            })}

            {/* 浅色模式下的云朵 */}
            {!isDark && (
                <>
                    <div className="absolute top-[5%] left-[10%] animate-[float_6s_ease-in-out_infinite]">
                        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
                            <ellipse cx="30" cy="35" rx="25" ry="20" fill="white" opacity="0.7" />
                            <ellipse cx="55" cy="30" rx="30" ry="25" fill="white" opacity="0.7" />
                            <ellipse cx="85" cy="35" rx="28" ry="22" fill="white" opacity="0.7" />
                        </svg>
                    </div>
                    <div className="absolute top-[15%] right-[15%] animate-[float_8s_ease-in-out_infinite_1s]">
                        <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
                            <ellipse cx="25" cy="30" rx="20" ry="18" fill="white" opacity="0.6" />
                            <ellipse cx="50" cy="25" rx="25" ry="20" fill="white" opacity="0.6" />
                            <ellipse cx="75" cy="30" rx="22" ry="18" fill="white" opacity="0.6" />
                        </svg>
                    </div>
                    <div className="absolute top-[8%] left-[50%] animate-[float_7s_ease-in-out_infinite_2s]">
                        <svg width="90" height="45" viewBox="0 0 90 45" fill="none">
                            <ellipse cx="20" cy="25" rx="18" ry="15" fill="white" opacity="0.5" />
                            <ellipse cx="45" cy="22" rx="22" ry="18" fill="white" opacity="0.5" />
                            <ellipse cx="68" cy="25" rx="20" ry="16" fill="white" opacity="0.5" />
                        </svg>
                    </div>
                </>
            )}

            {/* 小鸟 (浅色模式) */}
            {!isDark && (
                <>
                    <div className="absolute top-[12%] left-[30%] animate-[float_4s_ease-in-out_infinite]">
                        <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
                            <path d="M5 10 Q10 5 15 10" stroke="hsl(220, 40%, 50%)" strokeWidth="2" fill="none" opacity="0.6" />
                            <path d="M15 10 Q20 5 25 10" stroke="hsl(220, 40%, 50%)" strokeWidth="2" fill="none" opacity="0.6" />
                        </svg>
                    </div>
                    <div className="absolute top-[20%] right-[25%] animate-[float_5s_ease-in-out_infinite_1s]">
                        <svg width="25" height="18" viewBox="0 0 25 18" fill="none">
                            <path d="M4 9 Q8 5 12 9" stroke="hsl(220, 40%, 50%)" strokeWidth="1.8" fill="none" opacity="0.5" />
                            <path d="M12 9 Q16 5 20 9" stroke="hsl(220, 40%, 50%)" strokeWidth="1.8" fill="none" opacity="0.5" />
                        </svg>
                    </div>
                </>
            )}

            {/* 闪烁的星星 */}
            {starPositions.map((star, i) => (
                <div
                    key={i}
                    className="absolute animate-pulse"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                            fill={isDark ? 'white' : `hsl(${star.hue}, 70%, 70%)`}
                            opacity={isDark ? 0.9 : 0.5}
                        />
                    </svg>
                </div>
            ))}

            {/* 气球 (浅色模式) */}
            {!isDark && (
                <>
                    <div className="absolute bottom-[10%] right-[20%] animate-[float_5s_ease-in-out_infinite]">
                        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
                            <ellipse cx="20" cy="20" rx="18" ry="22" fill="hsl(340, 70%, 75%)" opacity="0.8" />
                            <line x1="20" y1="42" x2="20" y2="58" stroke="hsl(340, 70%, 60%)" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="absolute bottom-[15%] left-[25%] animate-[float_6s_ease-in-out_infinite_1.5s]">
                        <svg width="35" height="55" viewBox="0 0 35 55" fill="none">
                            <ellipse cx="17.5" cy="17" rx="16" ry="20" fill="hsl(200, 70%, 75%)" opacity="0.8" />
                            <line x1="17.5" y1="37" x2="17.5" y2="52" stroke="hsl(200, 70%, 60%)" strokeWidth="1.5" />
                        </svg>
                    </div>
                </>
            )}

            {/* 小花朵 (浅色模式) */}
            {!isDark && flowerPositions.map((flower, i) => (
                <div
                    key={`flower-${i}`}
                    className="absolute"
                    style={{
                        bottom: `${flower.bottom}%`,
                        left: `${flower.left}%`,
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="3" fill={`hsl(${flower.hue}, 70%, 70%)`} opacity="0.6" />
                        {flower.petals.map((petal, j) => (
                            <circle
                                key={j}
                                cx={petal.cx}
                                cy={petal.cy}
                                r="2.5"
                                fill={`hsl(${flower.hue + 30}, 70%, 75%)`}
                                opacity="0.5"
                            />
                        ))}
                    </svg>
                </div>
            ))}
        </div>
    )
}

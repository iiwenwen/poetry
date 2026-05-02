import React from 'react'

const stars = [
  { top: '18%', left: '14%', color: 'hsl(50 90% 72%)' },
  { top: '28%', left: '82%', color: 'hsl(340 75% 78%)' },
  { top: '52%', left: '10%', color: 'hsl(200 70% 76%)' },
  { top: '68%', left: '76%', color: 'hsl(280 65% 78%)' },
  { top: '84%', left: '24%', color: 'hsl(50 90% 72%)' },
  { top: '78%', left: '58%', color: 'hsl(200 70% 76%)' },
]

export default function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="absolute top-[4%] right-[9%] opacity-70">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="18" fill="hsl(50 90% 65%)" />
          <path
            d="M36 4v10M36 58v10M4 36h10M58 36h10M13 13l7 7M52 52l7 7M59 13l-7 7M20 52l-7 7"
            stroke="hsl(50 90% 65%)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="absolute top-[7%] left-[8%] opacity-55">
        <svg width="112" height="52" viewBox="0 0 112 52" fill="none">
          <ellipse cx="28" cy="28" rx="24" ry="17" fill="white" />
          <ellipse cx="54" cy="24" rx="28" ry="20" fill="white" />
          <ellipse cx="82" cy="29" rx="24" ry="17" fill="white" />
        </svg>
      </div>

      <div className="absolute top-[15%] right-[18%] opacity-45">
        <svg width="96" height="44" viewBox="0 0 96 44" fill="none">
          <ellipse cx="24" cy="25" rx="19" ry="14" fill="white" />
          <ellipse cx="49" cy="21" rx="24" ry="17" fill="white" />
          <ellipse cx="72" cy="25" rx="20" ry="14" fill="white" />
        </svg>
      </div>

      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute"
          style={{ top: star.top, left: star.left, opacity: 0.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 0L8.3 5.7L14 7L8.3 8.3L7 14L5.7 8.3L0 7L5.7 5.7L7 0Z" fill={star.color} />
          </svg>
        </div>
      ))}

      <div className="absolute bottom-[11%] right-[18%] opacity-65">
        <svg width="36" height="54" viewBox="0 0 36 54" fill="none">
          <ellipse cx="18" cy="18" rx="15" ry="18" fill="hsl(340 70% 76%)" />
          <line x1="18" y1="36" x2="18" y2="52" stroke="hsl(340 60% 60%)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute bottom-[16%] left-[22%] opacity-65">
        <svg width="32" height="50" viewBox="0 0 32 50" fill="none">
          <ellipse cx="16" cy="16" rx="14" ry="16" fill="hsl(200 70% 76%)" />
          <line x1="16" y1="32" x2="16" y2="48" stroke="hsl(200 60% 60%)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}

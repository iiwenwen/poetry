
import Tabs from './Tabs'
import React from 'react'

export default function Header() {
  return (
    <header className="p-4 mb-4">
      <div className="flex text-3xl items-center justify-center p-4 gap-4">
        {/* 纯色标题 - 真正的绘本风格 */}
        <h1 className="font-bold text-primary">
          让我为你读首诗 ✨
        </h1>
      </div>
      <Tabs />
    </header>
  )
}

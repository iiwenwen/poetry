import React from 'react'
import { usePoetryContext } from '@/features/poetry'
import { TAGS } from '../lib/config'
import type { TabsProps } from '../types'
import { Tabs as TabsRoot, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Tabs(props: TabsProps) {
  const { activeTab, setActiveTab } = usePoetryContext()

  return (
    <TabsRoot value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto gap-2 bg-transparent p-2">
        <TabsTrigger
          value={TAGS.HAIKU}
          className="text-base font-bold rounded-full border-4 border-storybook-pink
                     data-[state=active]:bg-storybook-pink
                     data-[state=active]:text-white data-[state=active]:scale-105
                     transition-all duration-300 shadow-md hover:shadow-lg
                     data-[state=inactive]:bg-white/50 data-[state=inactive]:hover:bg-white/80"
        >
          来写首俳句吧
        </TabsTrigger>
        <TabsTrigger
          value={TAGS.POEM}
          className="text-base font-bold rounded-full border-4 border-storybook-blue
                     data-[state=active]:bg-storybook-blue
                     data-[state=active]:text-white data-[state=active]:scale-105
                     transition-all duration-300 shadow-md hover:shadow-lg
                     data-[state=inactive]:bg-white/50 data-[state=inactive]:hover:bg-white/80"
        >
          来写首诗吧
        </TabsTrigger>
      </TabsList>
    </TabsRoot>
  )
}

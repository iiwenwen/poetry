import Header from './Header'
import Head from './head'
import React from 'react'
import { PoetryProvider } from '@/features/poetry'
import BackgroundDecorations from './BackgroundDecorations'
import { ThemeProvider } from '@/features/theme'
import ThemeToggle from './ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <PoetryProvider>
        <BackgroundDecorations />
        <Head />
        <Header />
        <ThemeToggle />
        <main className='lg:w-3/5 mx-auto heti space-y-4 relative z-10' >
          {children}
        </main>
        {/* <MoreButton /> */}
      </PoetryProvider>
    </ThemeProvider>
  )
}


import Header from './Header'
import Head from './head'
import React from 'react'
import { TabDataProvider } from './TabDataContext'

export default function Layout ({ children }) {

  return (
    <TabDataProvider>
      <Head />
      <Header />
      <main className='lg:w-3/5 mx-auto heti space-y-4' >
        {children}
      </main>
    </TabDataProvider >

  )
}


import { useSWR } from 'swr'
import useSWRInfinite from "swr/infinite"

import React, { createContext, useState, useEffect } from 'react'


const TabDataContext = createContext()

export function TabDataProvider ({ children }) {

  const [activeTab, setActiveTab] = useState('来写首俳句吧')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  return (
    <TabDataContext.Provider value={{ activeTab, setActiveTab, limit, setLimit, offset, setOffset }}>
      {children}
    </TabDataContext.Provider>
  )
}
const fetcher = (...args) => fetch(...args).then((res) => res.json())
const fetchMemories = (pageIndex, tag) => {
  const url = `https://iimemos.fly.dev/api/v1/memo?creatorId=1&tag=${tag}&limit=10&offset=${pageIndex * 10}`
  return url
}


export function getDate (tag,) {
  const url = "https://iimemos.fly.dev/api/v1/memo?creatorId=1"

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading
  } = useSWRInfinite((index) => `${url}&tag=${tag}&limit=10&offset=${index * 10}`, fetcher)



  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isReachingEnd = isValidating && (data && data[data.length - 1]?.length === 0)
  const tabData = data ? [].concat(...data) : []
  return {
    tabData,
    error,
    size,
    setSize,
    isLoadingMore,
    isReachingEnd
  }
}


export { TabDataContext }
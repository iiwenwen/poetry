import { useSWR } from 'swr'
import useSWRInfinite from "swr/infinite"

import React, { createContext, useState, useEffect } from 'react'


const TabDataContext = createContext()

const API_URL = "https://memos.syaoran.me/api/v1/memos"; // 定义常量

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
const fetcher = (...args) => fetch(...args).then((res) => res.json().then(result => result))

const getKey = (pageIndex, previousPageData, tag) => {
  if (previousPageData && !previousPageData.nextPageToken) return null;

  if (pageIndex === 0) return `${API_URL}?filter=tag in ["${tag}"]`; // 使用常量

  return `${API_URL}?filter=tag in ["${tag}"]&pageToken=${previousPageData.nextPageToken}`; // 使用常量
}


export function getDate (tag) {

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading
  } = useSWRInfinite((pageIndex,previousPageData)=>getKey(pageIndex,previousPageData,tag),fetcher)
  // console.log('111',data)
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isReachingEnd = isValidating && (data && data[data.length - 1]?.length === 0)
  const tabData = data ? data.flatMap((page) => page.memos) : [];
  
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
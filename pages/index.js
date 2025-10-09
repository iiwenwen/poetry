import CardContent from "../components/CardContent"
import CardImage from "../components/CardImage"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { TabDataContext, getDate } from "../components/TabDataContext"


export default function Home () {
  const { activeTab, } = useContext(TabDataContext)


  const { 
    tabData,
    error,
    size,
    setSize,
    isLoadingMore,
    isReachingEnd } = getDate(activeTab)

  if (error) return <div>error....</div>

  return (<>
    {
      tabData.map(item => (
        <div key={item.name} className="card lg:card-side bg-base-100 shadow-xl">
          <CardImage />
          <CardContent content={item.content} date={item.createTime} />
        </div >
      ))}

    <button onClick={() => setSize(size + 1)} >
      {
        isLoadingMore
          ? "Loading..."
          : isReachingEnd
            ? "No More"
            : "Load More"
      }</button>
  </>
  )
}


import CardContent from "../components/CardContent"
import CardImage from "../components/CardImage"
import React, { createContext, useContext, useEffect } from 'react'
import { TabDataContext } from "../components/TabDataContext"


export default function Home () {
  const { tabData } = useContext(TabDataContext)
  const isLoading = !tabData || tabData.length === 0
  return (
    <>
      {
        isLoading ? (
          <div>Loading...</div>
        ) : (
          tabData.map(item => (
            <div key={item.id} className="card lg:card-side bg-base-100 shadow-xl">
              <CardImage />
              <CardContent item={item} />
            </div >))
        )
      }

    </>
  )
}


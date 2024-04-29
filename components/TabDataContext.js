import React, { createContext, useState, useEffect } from 'react'


const TabDataContext = createContext()

export function TabDataProvider ({ children }) {

  const [activeTab, setActiveTab] = useState('来写首俳句吧')
  const [tabData, setData] = useState(null)

  const fetchTabData = async (tag) => {
    try {
      const response = await fetch(`https://iimemos.fly.dev/api/v1/memo?creatorId=1&tag=${tag}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const newData = await response.json()
      setData(newData)
    } catch (error) {
      console.error('Fetching data failed', error)
    }
  }
  useEffect(() => {
    if (activeTab) {
      fetchTabData(activeTab)
    }
  }, [activeTab])
  return (
    <TabDataContext.Provider value={{ activeTab, setActiveTab, tabData, fetchTabData }}>
      {children}
    </TabDataContext.Provider>
  )
}
export { TabDataContext }
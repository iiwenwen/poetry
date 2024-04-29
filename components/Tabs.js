import React, { useContext } from 'react'
import { TabDataContext } from './TabDataContext'

export default function Tabs () {
  const { activeTab, setActiveTab } = useContext(TabDataContext)

  const handleTabClick = (tag) => {
    setActiveTab(tag)
  }

  const getActiveClass = (tag) => {
    return activeTab === tag ? 'tab-active' : ''
  }

  return (
    <div role="tablist" className="tabs tabs-bordered justify-center p-2">
      <a role="tab" className={`tab ${getActiveClass('来写首俳句吧')}`} onClick={() => handleTabClick('来写首俳句吧')} >来写首俳句吧</a>
      <a role="tab" className={`tab ${getActiveClass('来写首诗吧')}`} onClick={() => handleTabClick('来写首诗吧')}>来写首诗吧</a>
    </div>

  )

}
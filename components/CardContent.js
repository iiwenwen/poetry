
import { marked } from "marked"
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { TabDataContext } from "../components/TabDataContext"
import styles from "./CardContent.module.css"

marked.setOptions({
  breaks: true,
  langPrefix: 'language-',
  gfm: true,
})
function formatUnixTimestamp (unixTimestamp) {
  return useMemo(() => {
    const date = new Date(unixTimestamp * 1000)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(date)
    return formattedDate.replace(/\//g, '.')
  }, [unixTimestamp])
}

export default React.memo(function CardContent ({ content, date }) {
  const { activeTab } = useContext(TabDataContext)
  const homeClassName = activeTab === '来写首俳句吧' ? styles.poetry : ''
  if (!content) {
    return null
  }
  const processedContent = useMemo(() => {
    return content
      .replace(/#来写首俳句吧( \d+\/\d+)?/g, "")
      .replace(/#来写首诗吧( \d+\/\d+)?/g, "")
      .replace(/Day \d+年\d+月\d+日 \d+:\d+:\d+/g, "")
      .trim()
  }, [content])
  const parsedContent = useMemo(() => marked(processedContent), [processedContent])

  return (<div className={`card-body lg:w-1/2 ${homeClassName}`}>
    <h2 className="card-title">{activeTab}</h2>
    <div className="card-content" dangerouslySetInnerHTML={{ __html: parsedContent }} />
    <p>创建于：{formatUnixTimestamp(date)}</p>
  </div>)
})
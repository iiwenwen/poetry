
import { marked } from "marked"
import React, { useContext, useState, useEffect } from 'react'
import { TabDataContext } from "../components/TabDataContext"

marked.setOptions({
  breaks: true,
  langPrefix: 'language-',
  gfm: true,
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
})
function formatUnixTimestamp (unixTimestamp) {
  const date = new Date(unixTimestamp * 1000)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(date)
  const formattedDateWithDots = formattedDate.replace(/\//g, '.')
  return formattedDateWithDots
}

export default function CardContent ({ item }) {
  const formattedDate = formatUnixTimestamp(item.createdTs)
  const { activeTab } = useContext(TabDataContext)
  const homeClassName = activeTab === '来写首俳句吧' ? 'poetry' : ''
  const [htmlString, sethtmlString] = useState(null)
  const content = item.content.replace(/#来写首俳句吧( \d+\/\d+)?/g, "").replace(/#来写首诗吧( \d+\/\d+)?/g, "").replace(/Day \d+年\d+月\d+日 \d+:\d+:\d+/g, "").trim()
  const parse = (content) => sethtmlString(marked(content))
  useEffect(() => {
    parse(content)
  }, [content, activeTab])

  return (<div className={`card-body lg:w-1/2 ${homeClassName}`}>
    <h2 className="card-title">{activeTab}</h2>
    {htmlString ? (<>
      <div className="card-content" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <p>创建于：{formattedDate}</p>
    </>) : (
      <div>Loading...</div>
    )}
  </div>)
} 
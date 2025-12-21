import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* Heti 排版样式 */}
        <link rel="stylesheet" href="https://unpkg.com/heti/umd/heti.min.css" />

        {/* LXGW WenKai 字体 - 使用中国 CDN */}
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link
          href="https://fonts.loli.net/css2?family=LXGW+WenKai&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

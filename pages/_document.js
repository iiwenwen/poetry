import { Html, Head, Main, NextScript } from "next/document"

export default function Document () {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://cdnjs.sgcd.net/lxgw-wenkai-screen-webfont/lxgwwenkaigbscreen.css" />
        <link rel="stylesheet" href="https://cdnjs.sgcd.net/LXGWHeartSerif/result.css" />
        <link rel="stylesheet" href="//unpkg.com/heti/umd/heti.min.css" /></Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta property="og:title" content="brainwashd" key="title"/>
        <meta property="og:description" content="Analyze news articles and social media posts for potential biases and inaccuracies." key="description"/>
        <meta name="description" content="Fake News Detection| Analyze news and social media for biases and inaccuracies | brainwashd"/>
        <meta property="og:image" content="../assets/seo.png"/>
        <meta property="twitter:title" content="brainwashd" key="title"/>
        <meta name="twitter:description" content="Fake News Detection| Analyze news and social media for biases and inaccuracies | brainwashd"/>
        <meta property="twitter:image" content="../assets/seo.png"/>
        <meta property="twitter:site" content="www.brainwashd.me"/>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

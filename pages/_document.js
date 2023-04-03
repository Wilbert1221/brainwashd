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
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/android-chrome-192x192.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/android-chrome-512x512.png"/>
      </Head>
      <body>
      <div id="fb-root"></div>
      <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0" nonce="7SeeZqWL"></script>
        <Main />
        <div id="portal"/>
        <NextScript />
      </body>
    </Html>
  )
}

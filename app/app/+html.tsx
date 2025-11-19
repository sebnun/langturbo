import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta
          name="description"
          content="LangTurbo takes you from intermediate to fluent in record time using podcasts"
        />
        <meta
          property="og:description"
          content="LangTurbo takes you from intermediate to fluent in record time using podcasts"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image" content="/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LangTurbo - Learn Languages Faster" />
        <meta
          name="twitter:description"
          content="LangTurbo takes you from intermediate to fluent in record time using podcasts"
        />
        <meta name="twitter:image:width" content="1024" />
        <meta name="twitter:image:height" content="1024" />
        <meta name="twitter:image" content="/twitter-image.png" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="1024x1024" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="1024x1024" />
        <meta name="apple-itunes-app" content="app-id=6470313589" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import { Metadata } from "next";

import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { fontSans } from "@/lib/fonts";
import { Analytics } from "@/components/analytics";
import { Toaster } from "@/components/toaster";
import { ThemeProvider } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
// https://github.com/gokulkrishh/awesome-meta-and-manifest
// https://nikolasbarwicki.com/articles/seo-in-next-js-13-with-metadata-api
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: `${siteConfig.name} Team`,
      url: siteConfig.url,
    },
  ],
  creator: `${siteConfig.name} Team`,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter.account,
  },
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: `/manifest.json`,
  appleWebApp: {
    title: siteConfig.name,
    capable: true,
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  generator: "Next.js",
  publisher: "Vercel",
  viewport: {
    userScalable: false,
    initialScale: 1,
    width: "device-width",
    minimumScale: 1,
    maximumScale: 1,
  },
  applicationName: siteConfig.name,
  other: {
    "msapplication-tap-highlight": "no",
    "msapplication-navbutton-color": "#ffffff",
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/icons/icon-192x192.png",
    "msapplication-tooltip": siteConfig.name,
    "msapplication-starturl": "/",
    "mobile-web-app-capable": "yes",
    "theme-color": "#ffffff",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="relative flex flex-col min-h-screen">
              <SiteHeader />
              <div className="flex-1 flex child:flex-1">{children}</div>
              {/* <SiteFooter /> */}
            </div>
          </ThemeProvider>
          <Analytics />
          <Toaster />
        </body>
      </html>
    </>
  );
}

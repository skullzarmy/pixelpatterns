import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'PixelPatterns - Create Seamless Pixel Art Patterns',
  description: 'Free online pixel art editor for creating seamless tiling patterns. Design pixel art tiles with intuitive tools, color palettes, and export in multiple formats.',
  keywords: ['pixel art', 'pattern maker', 'tile editor', 'seamless patterns', 'pixel art tool', 'pattern generator', 'sprite editor'],
  authors: [{ name: 'FAFO Lab', url: 'https://fafolab.xyz' }],
  creator: 'FAFO Lab',
  publisher: 'PixelPatterns',
  metadataBase: new URL('https://pixelpatterns.app'),
  appleWebApp: {
    title: 'PixelPatterns',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PixelPatterns - Create Seamless Pixel Art Patterns',
    description: 'Free online pixel art editor for creating seamless tiling patterns. Design, preview, and export pixel art tiles with ease.',
    url: 'https://pixelpatterns.app',
    siteName: 'PixelPatterns',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PixelPatterns - Pixel Art Pattern Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PixelPatterns - Create Seamless Pixel Art Patterns',
    description: 'Free online pixel art editor for creating seamless tiling patterns.',
    images: ['/og-image.png'],
    creator: '@fafolab',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'PixelPatterns',
              description: 'Free online pixel art editor for creating seamless tiling patterns',
              url: 'https://pixelpatterns.app',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

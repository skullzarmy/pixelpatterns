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
    title: "PixelPatterns - Create Seamless Pixel Art Patterns",
    description:
        "Free online pixel art editor for creating seamless tiling patterns. Design pixel art tiles with intuitive tools, color palettes, and export in multiple formats.",
    keywords: [
        "pixel art",
        "pattern maker",
        "tile editor",
        "seamless patterns",
        "pixel art tool",
        "pattern generator",
        "sprite editor",
    ],
    authors: [{ name: "FAFO Lab", url: "https://fafolab.xyz" }],
    creator: "FAFO Lab",
    publisher: "PixelPatterns",
    metadataBase: new URL("https://pixel.fafolab.xyz"),
    appleWebApp: {
        title: "PixelPatterns",
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "PixelPatterns - Create Seamless Pixel Art Patterns",
        description:
            "Free online pixel art editor for creating seamless tiling patterns. Design, preview, and export pixel art tiles with ease.",
        url: "https://pixel.fafolab.xyz",
        siteName: "PixelPatterns",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PixelPatterns - Create Seamless Pixel Art Patterns",
        description: "Free online pixel art editor for creating seamless tiling patterns.",
        creator: "@fafolab",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

import { ThemeProvider } from "@/components/theme-provider";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#8b5cf6" />
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <json schema>
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "WebApplication",
                                    "@id": "https://pixel.fafolab.xyz/#webapp",
                                    name: "PixelPatterns",
                                    description:
                                        "Free online pixel art editor for creating seamless tiling patterns with intuitive drawing tools, color palettes, and export options",
                                    url: "https://pixel.fafolab.xyz",
                                    applicationCategory: "DesignApplication",
                                    operatingSystem: "Any",
                                    browserRequirements: "Requires JavaScript. Requires HTML5.",
                                    offers: {
                                        "@type": "Offer",
                                        price: "0",
                                        priceCurrency: "USD",
                                    },
                                    creator: {
                                        "@type": "Organization",
                                        "@id": "https://fafolab.xyz/#organization",
                                        name: "FAFO Lab",
                                        url: "https://fafolab.xyz",
                                    },
                                    featureList: [
                                        "Pixel art drawing tools (pen, eraser, fill)",
                                        "Custom color palettes",
                                        "Seamless pattern tiling preview",
                                        "Variable canvas size (4-64px)",
                                        "Export to PNG, SVG, CSS",
                                        "Save/load projects (.fafo format)",
                                        "Dark/light theme support",
                                        "Keyboard shortcuts",
                                    ],
                                },
                                {
                                    "@type": "WebSite",
                                    "@id": "https://pixel.fafolab.xyz/#website",
                                    url: "https://pixel.fafolab.xyz",
                                    name: "PixelPatterns",
                                    description: "Free online pixel art pattern editor",
                                    publisher: {
                                        "@type": "Organization",
                                        "@id": "https://fafolab.xyz/#organization",
                                    },
                                },
                                {
                                    "@type": "BreadcrumbList",
                                    itemListElement: [
                                        {
                                            "@type": "ListItem",
                                            position: 1,
                                            name: "Home",
                                            item: "https://pixel.fafolab.xyz",
                                        },
                                    ],
                                },
                            ],
                        }),
                    }}
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

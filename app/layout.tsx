import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hook & Script Studio — Viral Hooks ⋅ 60s Scripts in Seconds",
  description:
    "Generate 20 scroll-stopping hooks + a tight 45–60s script, B-roll ideas & CTAs. Built for TikTok, Reels, Shorts. 3 free runs. Unlock unlimited.",
  icons: {
  icon: [
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
  shortcut: "/favicon-32x32.png",
},
  openGraph: {
  images: [
    {
      url: "/og-1200x630.png",
      width: 1200,
      height: 630,
      alt: "Hook & Script Studio – AI Video Hook Engine",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "Hook & Script Studio",
  description:
    "Generate scroll-stopping hooks, scripts, B-roll ideas, and CTAs. 3 free runs, then unlock unlimited.",
  images: ["/og-1200x630.png"], // ← using the same file
},
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Hook & Script Studio",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "Generate hooks, 60s scripts, B-roll ideas, and CTAs for short-form video.",
          offers: {
            "@type": "Offer",
            price: "9.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          url:
            process.env.NEXT_PUBLIC_BASE_URL ||
            "https://hook-script-studio.vercel.app",
          image: `https://hook-script-studio.vercel.app/og-image.png`,
          publisher: { "@type": "Organization", name: "Hook & Script Studio" },
        }),
      }}
    />
  </head>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        {children}

        {/* Vercel Analytics (client) */}
        <Analytics />

        {/* Belt & suspenders: direct script load */}
        <script defer src="/_vercel/insights/script.js"></script>

        {/* Tiny verifier: writes to console so we know this file rendered */}
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log("Analytics mount check: layout rendered at", new Date().toISOString());`,
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
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
  title: "Hook & Script Studio — Viral Hooks & 60s Scripts in Seconds",
  description:
    "Generate 20 hooks by angle + a tight 45–60s script, B-roll, and CTAs. Built for TikTok, Reels, Shorts. 3 free runs, then unlock unlimited.",
  openGraph: {
    title: "Hook & Script Studio",
    description:
      "Generate hooks, scripts, B-roll, and CTAs for short-form video in seconds.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Hook & Script Studio",
    images: [
      {
        url: "/og-image.png",   // ← UPDATE THIS to match the file in public/
        width: 1200,
        height: 630,
        alt: "Hook & Script Studio",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Head from "next/head";
import React from "react";
import Script from 'next/script';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles.css";
import { ThirdwebProvider } from "thirdweb/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "notl[dot]ink - free open source blazingly fast url shortener ever",
  description: "notl[dot]ink is a free, open-source blazingly url shortener that lets you create short, shareable links easily and quickly. Super clean ui/ux, no ads, no tracking, no cookies, no bullshit.",
  metadataBase: new URL("https://notl.ink/"),
  keywords: ["url shortener", "free url shortener", "open-source url shortener", "open-source"],
  alternates: {
    canonical: "/",
  },
  authors: [
    {
      name: "Ibrohim Abdivokhidov",
      url: "https://github.com/abdibrokhim",
    },
  ],
  openGraph: {
    title: "notl[dot]ink - free open source blazingly fast url shortener ever",
    description: "notl[dot]ink is a free, open-source blazingly url shortener that lets you create short, shareable links easily and quickly. Super clean ui/ux, no ads, no tracking, no cookies, no bullshit.",
    type: "website",
    url: "/",
    siteName: "notlink",
    images: [
      {
        url: "/assets/notlink.png",
        width: 1200,
        height: 630,
        alt: "notlink official logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "notl[dot]ink - free open source blazingly fast url shortener ever",
    description: "notl[dot]ink is a free, open-source blazingly url shortener that lets you create short, shareable links easily and quickly. Super clean ui/ux, no ads, no tracking, no cookies, no bullshit.",
    images: ["/assets/notlink.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
        {children}
        </ThirdwebProvider>
        <div id="cursor-particles"></div>
        <Script src="/scripts.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

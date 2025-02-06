import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "this is notlink - a new kind of url shortener",
  description: "this is notlink - a new kind of url shortener",
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
    title: "this is notlink - a new kind of url shortener",
    description: "this is notlink - a new kind of url shortener",
    type: "website",
    url: "/",
    images: [
      {
        url: "/assets/notlink-logo.png",
        width: 1200,
        height: 630,
        alt: "OG Image",
      },
    ],
  },
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
        <ThirdwebProvider>
        {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}

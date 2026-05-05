import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://fdac.witus.online";
const SITE_NAME = "FDAC";
const TITLE = "Foundations of Fitness and Health Metrics | FDAC";
const DESCRIPTION =
  "Learn to harness the power of personal metrics for better health decisions. A 5-week course for coaches, trainers, and data-curious athletes who want to turn fitness data into longevity insights.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | FDAC" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Brand Anthony McDonald", url: "https://brandanthonymcdonald.com" }],
  keywords: [
    "fitness data analytics",
    "health metrics",
    "wearable data",
    "longevity",
    "intensity minutes",
    "centenarian",
    "B4C LLC",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-cyan-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://card.app.aidimsum.com";
const title = "粵語知識分享";
const description = "用 DimSum 生成和分享粵語詞條、粵拼、釋義和語料來源卡片。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  applicationName: "DimSum Card",
  keywords: ["粵語", "粤语", "粵拼", "粤拼", "Cantonese", "DimSum"],
  authors: [{ name: "DimSum" }],
  creator: "DimSum",
  publisher: "DimSum",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "DimSum",
    type: "website",
    locale: "zh_HK",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "DimSum",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}

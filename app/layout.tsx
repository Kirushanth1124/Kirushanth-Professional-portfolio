import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import ThemeProvider from "@/components/providers/ThemeProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://your-domain.com"
  ),

  title: {
    default: "Kirushanth | Software Engineer",
    template: "%s | Kirushanth",
  },

  description:
    "Portfolio of Kirushanth, a Software Engineer focused on full-stack development, scalable web applications, modern digital solutions, and emerging technologies.",

  keywords: [
    "Kirushanth",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Web Developer",
    "Portfolio",
    "Sri Lanka",
  ],

  authors: [
    {
      name: "Kirushanth",
    },
  ],

  creator: "Kirushanth",
  publisher: "Kirushanth",

  icons: {
    icon: "/icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Kirushanth Portfolio",

    title: "Kirushanth | Software Engineer",

    description:
      "Explore Kirushanth's software engineering projects, skills, experience, certificates, and professional work.",

    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Kirushanth Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Kirushanth | Software Engineer",

    description:
      "Explore Kirushanth's software engineering projects, skills, experience, and achievements.",

    images: ["/icon.png"],
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
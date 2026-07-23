import type { Metadata } from "next";
import { Public_Sans, Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpotDraft Clone",
  description: "Contract lifecycle management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}

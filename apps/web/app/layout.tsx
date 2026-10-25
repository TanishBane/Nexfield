import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppShell } from "@/components/layout/AppShell";

const displayFont = localFont({
  src: [
    { path: "../public/fonts/butler-rmn.woff2", weight: "400" },
    { path: "../public/fonts/butler-bd.woff2", weight: "700" },
    { path: "../public/fonts/butler-blk.woff2", weight: "900" },
  ],
  variable: "--font-serif",
  display: "swap",
});
const interfaceFont = localFont({
  src: "../public/fonts/gidole.ttf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXFIELD — Agricultural Intelligence Operating System",
  description:
    "Comprehensive AI-powered agronomic operating system supporting crop cultivation, disease diagnosis, digital twin scenario simulation, operational ledger, and Mandi market intelligence.",
  keywords: [
    "Agriculture AI",
    "Smart Farming",
    "Digital Twin",
    "Crop Disease Detection",
    "Mandi Prices",
    "Food Technology",
  ],
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        className={`min-h-screen ${interfaceFont.variable} ${displayFont.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}

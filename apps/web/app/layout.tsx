import type { Metadata } from 'next';
import { Instrument_Serif, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AppShell } from '@/components/layout/AppShell';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEXFIELD — Agricultural Intelligence Operating System',
  description:
    'Comprehensive AI-powered agronomic operating system supporting crop cultivation, disease diagnosis, digital twin scenario simulation, operational ledger, and Mandi market intelligence.',
  keywords: [
    'Agriculture AI',
    'Smart Farming',
    'Digital Twin',
    'Crop Disease Detection',
    'Mandi Prices',
    'Food Technology',
  ],
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen bg-[#090D0B] ${manrope.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased text-[#F1F5F2]`}>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}

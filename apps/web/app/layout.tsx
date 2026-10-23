import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AppShell } from '@/components/layout/AppShell';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090D0B] font-sans antialiased text-[#F1F5F2]">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}

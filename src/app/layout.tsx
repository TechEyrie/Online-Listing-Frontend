import type { Metadata } from 'next';

import { AssistantWidget } from '@/components/assistant/assistant-widget';
import { MosqueArchClip } from '@/components/common/mosque-arch-clip';
import { AppProviders } from '@/providers/app-providers';

import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Suqora';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${appName} — Buy & Sell Anything`,
    template: `%s | ${appName}`,
  },
  description:
    "Qatar's classifieds marketplace. Buy, sell, rent, or offer services. Vehicles, property, electronics, jobs and more.",
  keywords: ['Suqora', 'classifieds', 'marketplace', 'buy', 'sell', 'Qatar', 'listings', 'Doha'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: appName,
    title: `${appName} — Buy & Sell Anything`,
    description: "Qatar's classifieds marketplace.",
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} — Buy & Sell Anything`,
    description: "Qatar's classifieds marketplace.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: appUrl },
  icons: {
    icon: '/suqora-mark.png',
    apple: '/suqora-mark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <MosqueArchClip />
        <AppProviders>
          {children}
          <AssistantWidget />
        </AppProviders>
      </body>
    </html>
  );
}

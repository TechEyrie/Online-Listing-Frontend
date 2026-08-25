import type { Metadata } from 'next';
import { Outfit, Syne } from 'next/font/google';

import { AppProviders } from '@/providers/app-providers';

import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
});

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
      <body className={`${outfit.variable} ${syne.variable} min-h-screen antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

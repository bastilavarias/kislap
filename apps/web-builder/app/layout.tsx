import type { ReactNode } from 'react';

import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import NextProvider from '@/providers/NextProvider';
import { SettingsProvider } from '@/contexts/settings-context';
import { ThemeProvider } from '@/providers/ThemesProvider';
import { Toaster } from '@/components/ui/sonner';

import { getMode, getSettingsFromCookie } from '@/lib/serverHelpers';
import { cn } from '@/lib/utils';

import './globals.css';

import NextTopLoader from 'nextjs-toploader';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kislap.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Kislap - Turn Forms into Stunning Websites',
    template: '%s | Kislap',
  },
  description:
    'The open-source website builder for developers. Transform simple forms and JSON into professional portfolios, landing pages, and waitlists in seconds.',
  applicationName: 'Kislap',
  authors: [{ name: '@bastilavarias', url: APP_URL }],
  keywords: [
    'website builder',
    'portfolio builder',
    'form to website',
    'json to website',
    'resume builder',
    'developer portfolio',
    'open source website builder',
    'shadcn ui builder',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Kislap',
  publisher: 'Kislap',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Kislap',
    title: 'Kislap - Turn Forms into Stunning Websites',
    description:
      'No drag and drop chaos. No design skills needed. Just fill in the blanks, and Kislap generates a high-performance site instantly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kislap - AI Powered Website Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kislap - Turn Forms into Stunning Websites',
    description:
      'No drag and drop chaos. No design skills needed. Just fill in the blanks, and Kislap generates a high-performance site instantly.',
    images: ['/og-image.png'],
    creator: '@bastilavarias',
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const mode = await getMode();
  const settingsCookie = await getSettingsFromCookie();

  return (
    <html
      lang="en"
      className={cn(
        fontSans.variable,
        fontMono.variable,
        'flex min-h-full w-full scroll-smooth',
        mode
      )}
      style={{ colorScheme: mode }}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Noto+Serif+Georgian:wght@100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Gamja+Flower&family=Delius+Swash+Caps&family=Gabriela&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full w-full flex-auto flex-col antialiased">
        <NextTopLoader
          color="#ff3132"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <NextProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <ThemeProvider>{children}</ThemeProvider>
            <Toaster />
          </SettingsProvider>
        </NextProvider>
      </body>
    </html>
  );
};

export default RootLayout;

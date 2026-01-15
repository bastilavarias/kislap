// React Imports
import type { ReactNode } from 'react';

// Next Imports
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

// Component Imports
import NextProvider from '@/providers/NextProvider';
import { SettingsProvider } from '@/contexts/settings-context';
import { ThemeProvider } from '@/providers/ThemesProvider';
import { Toaster } from '@/components/ui/sonner';

// Util Imports
import { getMode, getSettingsFromCookie } from '@/lib/serverHelpers';
import { cn } from '@/lib/utils';

// Style Imports
import './globals.css';

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
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: '%s | Kislap',
    default: 'Kislap - Turn Forms into Stunning Websites',
  },
  description:
    'Turn your forms and data into stunning portfolios. The open-source website builder for developers who value their time.',
  applicationName: 'Kislap',
  authors: [{ name: 'Kislap Team', url: APP_URL }],
  generator: 'Next.js',
  keywords: [
    'website builder',
    'portfolio builder',
    'developer tools',
    'resume builder',
    'open source',
    'shadcn ui',
  ],
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
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Kislap',
    title: 'Kislap - Turn Forms into Stunning Websites',
    description: 'Turn your forms and data into stunning portfolios instantly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kislap Builder Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kislap - Turn Forms into Stunning Websites',
    description: 'Turn your forms and data into stunning portfolios instantly.',
    images: ['/og-image.png'],
    creator: '@kislap_app',
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const mode = await getMode();
  const settingsCookie = await getSettingsFromCookie();

  return (
    <html
      lang="en"
      // suppressHydrationWarning is needed because next-themes updates the HTML class
      suppressHydrationWarning
      className={cn(
        fontSans.variable,
        fontMono.variable,
        'flex min-h-full w-full scroll-smooth',
        mode
      )}
      style={{ colorScheme: mode }}
    >
      <head>
        {/* Keep this ONLY if your Builder needs these fonts immediately.
           Otherwise, consider loading fonts dynamically per project to save bandwidth.
        */}
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </head>
      <body className="flex min-h-full w-full flex-auto flex-col antialiased bg-background text-foreground">
        <NextProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Noto+Serif+Georgian:wght@100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Gamja+Flower&family=Delius+Swash+Caps&family=Gabriela&display=swap';

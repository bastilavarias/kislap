import { Metadata } from 'next';
import { LandingPageContent } from './components/landing-page-content'; // We will create this next

// 1. SEO: Robust Metadata Configuration
export const metadata: Metadata = {
  title: 'Kislap | Build Professional Websites in Seconds, Not Hours',
  description:
    'Turn your data into high-converting, SEO-optimized websites instantly. The fastest website builder for startups, portfolios, and creators. No coding required.',
  keywords: [
    'website builder',
    'portfolio builder',
    'instant website',
    'no-code',
    'startup landing page',
    'link in bio',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kislap.app',
    title: 'Kislap - The Instant Website Builder',
    description: 'Stop fighting with drag-and-drop. Build your site in seconds.',
    siteName: 'Kislap',
    images: [
      {
        url: 'https://kislap.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kislap Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kislap - Build Faster',
    creator: '@yourhandle',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kislap',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'An AI-powered website builder that turns forms into websites.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '150',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex flex-col min-h-screen selection:bg-primary/20">
        <LandingPageContent />
      </main>
    </>
  );
}

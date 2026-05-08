import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const defaultMetadata: Metadata = {
  title: {
    default: 'MDXFlow - Markdown & Flowchart Editor',
    template: '%s | MDXFlow'
  },
  description: 'A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder using React Flow and Mermaid. Create, edit, and visualize your ideas seamlessly.',
  keywords: [
    'markdown',
    'mdx',
    'editor',
    'flowchart',
    'mermaid',
    'react flow',
    'diagram',
    'documentation',
    'writing',
    'visual editor'
  ],
  authors: [{ name: 'MDXFlow Team' }],
  creator: 'MDXFlow',
  publisher: 'MDXFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MDXFlow - Markdown & Flowchart Editor',
    description: 'A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder using React Flow and Mermaid.',
    url: '/',
    siteName: 'MDXFlow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MDXFlow - Markdown & Flowchart Editor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDXFlow - Markdown & Flowchart Editor',
    description: 'A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder using React Flow and Mermaid.',
    images: ['/og-image.png'],
    creator: '@mdxflow',
  },
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
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
}): Metadata {
  const pageTitle = title ? `${title} | MDXFlow` : 'MDXFlow - Markdown & Flowchart Editor'
  const pageDescription = description || 'A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder using React Flow and Mermaid.'
  const pageUrl = `${baseUrl}${path}`
  const pageImage = image || '/og-image.png'

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || 'MDXFlow',
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
  }
}

// Structured data for the application
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MDXFlow',
  description: 'A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder using React Flow and Mermaid.',
  url: baseUrl,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'MDXFlow Team',
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString(),
  inLanguage: 'en',
  isAccessibleForFree: true,
}
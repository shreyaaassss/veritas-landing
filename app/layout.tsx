import React from "react"
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './pantone.css'


// Same typefaces as the homepage theme (Inter for text, JetBrains Mono for labels and code)
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

const SITE_URL = 'https://agentveritas.in'
const TITLE = 'Veritas | The DPDPA evidence layer for engineering teams'
const DESCRIPTION =
  'Veritas finds personal data in your logs, API responses and database changes, masks it on the host before it travels, ' +
  'and keeps tamper-evident evidence that an auditor can verify without trusting us. Self-hosted on your own infrastructure.'
const SHORT_DESCRIPTION =
  'Personal data caught at the source. Evidence an outsider can verify. Self-hosted, built for India\'s DPDP Act.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s | Veritas' },
  description: DESCRIPTION,
  applicationName: 'Veritas',
  keywords: [
    'DPDPA', 'DPDP Act 2023', 'personal data protection India', 'data privacy engineering', 'PII detection',
    'Aadhaar masking', 'PAN detection', 'log redaction', 'tamper-evident audit trail', 'evidence chain',
    'audit pack', 'data principal rights requests', 'self-hosted', 'on-premise privacy software',
  ],
  authors: [{ name: 'Veritas' }],
  creator: 'Veritas',
  publisher: 'Veritas',
  category: 'technology',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: SHORT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Veritas',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Veritas, the DPDPA evidence layer for engineering teams' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
}

// Structured data so search engines describe the product correctly
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Veritas',
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      email: 'hello@agentveritas.in',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Veritas',
      url: SITE_URL,
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Linux, macOS, Windows',
      description: DESCRIPTION,
      featureList: [
        'Masks, hashes or drops personal data on the host before a log line leaves it, and drops the line if masking fails',
        'Finds personal data in application logs, API responses, database schema changes, OpenTelemetry logs and syslog',
        'Groups repeated findings into incidents with an owning team, and reopens an incident when a fix does not hold',
        'Plain-language rules with severity floors and two-person approval for every change',
        'Hash-chained evidence with signed checkpoints kept by independent witnesses',
        'Stand-alone verifier that checks the evidence with no server, no network and no trust in Veritas',
        'Audit pack that states what the evidence proves and what it does not',
        'Rights requests by keyed hash, with signed records and alerts when an erased identifier appears again',
        'Pipeline gate that stops an undeclared personal-data column or API example before it ships',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
        {children}
      </body>
    </html>
  )
}

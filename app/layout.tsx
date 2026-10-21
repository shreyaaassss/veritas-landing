import React from "react"
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './pantone.css'


// Same typefaces as the homepage theme (Inter for text, JetBrains Mono for labels and code)
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: 'Veritas – On-Premise DPDPA Compliance for Indian Engineering Teams',
  description: 'Veritas detects personal data in your application logs, maps violations to DPDPA obligations, and records tamper-evident evidence — entirely on your own servers. No raw personal data leaves your network.',
  keywords: [
    'DPDPA compliance software India',
    'DPDPA log scanning',
    'Aadhaar in logs detection',
    'PAN card log compliance',
    'on-premise data compliance India',
    'DPDP Rules 2025',
    'personal data protection India',
    'log PII detection India',
    'tamper-evident audit evidence',
    'data compliance fintech India',
  ],
  authors: [{ name: 'Veritas' }],
  openGraph: {
    title: 'Veritas – On-Premise DPDPA Compliance for Indian Engineering Teams',
    description: 'Find Aadhaar and PAN in your logs before an auditor does. Veritas detects personal data violations, records tamper-evident evidence, and gives your compliance team a live dashboard — all on your own infrastructure.',
    type: 'website',
    siteName: 'Veritas',
    url: 'https://agentveritas.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veritas – On-Premise DPDPA Compliance',
    description: 'Detect personal data violations in your logs. DPDPA evidence on your own servers — no raw PII leaves your network.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Veritas",
                  "url": "https://agentveritas.in",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "hello@agentveritas.in",
                    "contactType": "customer support"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Veritas",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Linux, macOS, Windows",
                  "description": "On-premise DPDPA compliance software that detects personal data in application logs, records tamper-evident evidence, and provides a live compliance dashboard.",
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "INR",
                    "url": "https://agentveritas.in/pricing"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

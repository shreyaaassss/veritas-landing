"use client"

import Link from "next/link"

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Overview",      href: "/product" },
      { label: "How It Works",  href: "/how-it-works" },
      { label: "Use Cases",     href: "/use-cases" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Quickstart",    href: "/documentation/quickstart" },
      { label: "GitHub",        href: "https://github.com/shreyaaassss/Veritas", external: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",         href: "/about" },
      { label: "Contact",       href: "/contact" },
      { label: "Book a Demo",   href: "/book-demo" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy",       href: "/privacy" },
      { label: "Terms",         href: "/privacy#terms" },
      { label: "License",       href: "/license" },
      { label: "Security",      href: "/security" },
    ],
  },
]

export function VeritasFooter() {
  return (
    <footer className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        {/* Top row: logo + columns */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Brand */}
          <div className="shrink-0">
            <Link href="/" aria-label="Veritas home" className="inline-block">
              <img src="/veritas-wordmark.png" alt="Veritas" width={1726} height={375} className="block h-6 w-auto" />
            </Link>
            <p className="mt-4 text-xs text-white/50 leading-relaxed max-w-[200px]">
              On-premise DPDPA log compliance for Indian engineering and compliance teams.
            </p>
            {/* Status badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00cbaa]" />
              <span className="text-[10px] text-white/50 tracking-widest">v1.0.16 · GA</span>
            </div>
          </div>

          {/* Column links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <div className="text-[10px] text-white/45 tracking-widest uppercase mb-4">
                  {col.heading}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.label}>
                      {"external" in l && l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-white/55 hover:text-white/85 transition-colors tracking-wide"
                        >
                          {l.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="text-xs text-white/55 hover:text-white/85 transition-colors tracking-wide"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row: copyright */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs text-white/35">
            © 2026 Veritas. Commercial software. <a href="mailto:hello@agentveritas.in" className="hover:text-white/65 transition-colors">hello@agentveritas.in</a>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/35 hover:text-white/65 transition-colors tracking-widest">
              Privacy
            </Link>
            <Link href="/license" className="text-xs text-white/35 hover:text-white/65 transition-colors tracking-widest">
              License
            </Link>
            <a
              href="https://github.com/shreyaaassss/Veritas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/35 hover:text-white/65 transition-colors tracking-widest"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

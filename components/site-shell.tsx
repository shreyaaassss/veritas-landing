"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ChevronDown, Menu, Server, X } from "lucide-react"
import { AuthControls, AuthProvider } from "@/components/auth"
import "@/app/home-theme.css"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--tg-inter" })
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--tg-mono" })

// ─── Nav structure with dropdown groups ──────────────────────────────────────
const NAV = [
  {
    label: "Product",
    href: "/product",
    children: [
      { label: "Overview", href: "/product", desc: "What Veritas does" },
      { label: "How It Works", href: "/how-it-works", desc: "Detection → evidence pipeline" },
      { label: "Use Cases", href: "/use-cases", desc: "Fintech, healthcare, SaaS" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Docs",
    href: "/documentation",
    children: [
      { label: "Documentation", href: "/documentation", desc: "Full reference" },
      { label: "Quickstart", href: "/documentation/quickstart", desc: "Up and running in 15 min" },
      { label: "User Guide", href: "/documentation/user-guide", desc: "Dashboard & workflows" },
      { label: "Troubleshooting", href: "/documentation/troubleshooting", desc: "Common issues" },
    ],
  },
  { label: "Security", href: "/security" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About", href: "/about", desc: "Mission and team" },
      { label: "Contact", href: "/contact", desc: "Get in touch" },
      { label: "Book a Demo", href: "/book-demo", desc: "20-min live demo" },
    ],
  },
]

const FOOTER_COLS = [
  { heading: "Product", links: [{ label: "Overview", href: "/product" }, { label: "How It Works", href: "/how-it-works" }, { label: "Use Cases", href: "/use-cases" }, { label: "Pricing", href: "/pricing" }] },
  { heading: "Resources", links: [{ label: "Documentation", href: "/documentation" }, { label: "Quickstart", href: "/documentation/quickstart" }, { label: "GitHub", href: "https://github.com/shreyaaassss/Veritas", external: true }] },
  { heading: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Book a Demo", href: "/book-demo" }] },
  { heading: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/privacy#terms" }, { label: "License", href: "/license" }, { label: "Security", href: "/security" }] },
]

const PLATFORMS = ["Linux", "macOS", "Windows", "Kubernetes"]

/** Fades children in once they scroll into view. */
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`tg-reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ─── Individual nav item with optional dropdown ───────────────────────────────
function NavItem({ item, onNavigate }: { item: typeof NAV[0]; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  if (!item.children) {
    return (
      <Link href={item.href} className="tg-nav-item" onClick={onNavigate}>
        {item.label}
      </Link>
    )
  }

  return (
    <div ref={ref} className="tg-nav-group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className={`tg-nav-item tg-nav-trigger${open ? " open" : ""}`} aria-expanded={open} aria-haspopup="true">
        {item.label}
        <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && (
        <div className="tg-nav-dropdown" role="menu">
          {item.children.map(child => (
            <Link key={child.href} href={child.href} className="tg-nav-dropdown-item" role="menuitem" onClick={() => { setOpen(false); onNavigate?.() }}>
              <span className="tg-nav-dropdown-label">{child.label}</span>
              <span className="tg-nav-dropdown-desc">{child.desc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/** Homepage design system wrapper: fonts, sign-in state, header and footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false)

  // Flatten nav for mobile menu
  const mobileLinks = NAV.flatMap(n =>
    n.children
      ? n.children.map(c => ({ label: c.label, href: c.href }))
      : [{ label: n.label, href: n.href }]
  )

  return (
    <div className={`tg ${inter.variable} ${mono.variable}`}>
    <AuthProvider>

      {/* ── Floating glassmorphism navbar ── */}
      <header className="tg-header-float-wrap">
        <nav className="tg-header-float" aria-label="Main">
          {/* Logo */}
          <Link href="/" className="tg-logo" aria-label="Veritas home" style={{ flexShrink: 0, pointerEvents: "all", cursor: "pointer", position: "relative", zIndex: 1 }}>
            <img src="/veritas-wordmark.png" alt="Veritas" width={1726} height={375} />
          </Link>

          {/* Desktop nav items */}
          <div className="tg-nav-links-float">
            {NAV.map(item => <NavItem key={item.label} item={item} />)}
          </div>

          {/* Actions */}
          <div className="tg-nav-actions">
            <AuthControls variant="header" />
            <Link href="/book-demo" className="tg-btn tg-btn-white" style={{ fontSize: 13, padding: "7px 16px" }}>Book a Demo</Link>
            <button className="tg-burger" onClick={() => setMenu(v => !v)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}>
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile slide-down menu */}
        {menu && (
          <div className="tg-menu-float">
            {mobileLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)}>{l.label}</Link>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12, marginTop: 4 }}>
              <AuthControls variant="menu" onAction={() => setMenu(false)} />
            </div>
          </div>
        )}
      </header>

      {children}

      {/* ── Footer ── */}
      <footer className="tg-footer">
        <div className="tg-container">
          <div className="tg-footer-top">
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <Link href="/" className="tg-logo" aria-label="Veritas home"><img src="/veritas-wordmark.png" alt="Veritas" width={1726} height={375} /></Link>
              <p className="tg-body-sm" style={{ maxWidth: 240 }}>On-premise DPDPA log compliance for Indian engineering and compliance teams.</p>
              <span className="tg-pill" style={{ justifySelf: "start" }}>v1.0.16 · GA</span>
            </div>
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <h4>{col.heading}</h4>
                <ul>
                  {col.links.map(l => (
                    <li key={l.label}>
                      {"external" in l && l.external
                        ? <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
                        : <Link href={l.href}>{l.label}</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="tg-footer-plat">
            <span className="tg-caption" style={{ marginRight: 8 }}>Runs on</span>
            {PLATFORMS.map(os => <span key={os} className="tg-chip"><Server size={12} style={{ marginRight: 6 }} />{os}</span>)}
          </div>
          <div className="tg-footer-bottom">
            <span className="tg-caption">© 2026 Veritas. Commercial software. <a href="mailto:hello@agentveritas.in" style={{ color: "inherit", textDecoration: "underline" }}>hello@agentveritas.in</a></span>
            <span className="tg-caption tg-mono">v1.0.16</span>
          </div>
        </div>
      </footer>
    </AuthProvider>
    </div>
  )
}

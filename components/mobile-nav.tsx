"use client"

import { useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Product",      href: "/product" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Docs",         href: "/documentation" },
  { label: "Pricing",      href: "/pricing" },
  { label: "Download",     href: "/#download" },
  { label: "About",        href: "/about" },
  { label: "Contact",      href: "/contact" },
]

const NAV_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(0,0,0,0.72)",
  boxShadow: "rgba(255,255,255,0.1) 0px 0px 0px 0.5px inset",
} as const

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl">

        {/* Main bar */}
        <nav
          className="flex items-center justify-between px-5 py-3 rounded-[12px] border border-white/[0.08]"
          style={NAV_STYLE}
        >
          <Link href="/" aria-label="Veritas home" className="opacity-95 hover:opacity-100 transition-opacity">
            <img src="/veritas-wordmark.png" alt="Veritas" width={1726} height={375} className="block h-5 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] text-white/72 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/book-demo"
              className="text-[11px] px-4 py-2 rounded-full bg-[#eef35f] text-black font-medium hover:bg-[#f4f78a] transition-all duration-200 tracking-[0.012em] hidden md:block"
             
            >
              Book a Demo
            </Link>

            {/* Burger — mobile only */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className="block h-px bg-white/60 transition-all duration-300 origin-center"
                style={{ width: "18px", transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="block h-px bg-white/60 transition-all duration-300"
                style={{ width: "18px", opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }}
              />
              <span
                className="block h-px bg-white/60 transition-all duration-300 origin-center"
                style={{ width: "18px", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          className="md:hidden mt-2 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? "400px" : "0px", opacity: open ? 1 : 0 }}
        >
          <div
            className="rounded-[12px] border border-white/[0.08] px-2 py-2 flex flex-col"
            style={NAV_STYLE}
          >
            {NAV_LINKS.map(l => (
              <Link
                key={l.label}
                href={l.href}
                onClick={close}
                className="px-4 py-3 text-sm text-white/72 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors tracking-wide"
               
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-1 px-2 pb-1">
              <Link
                href="/book-demo"
                onClick={close}
                className="block w-full text-center text-[11px] px-4 py-2.5 rounded-full bg-[#eef35f] text-black font-medium hover:bg-[#f4f78a] transition-all duration-200 tracking-[0.012em]"
               
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

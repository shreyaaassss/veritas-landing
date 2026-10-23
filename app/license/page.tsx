"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
import Link from "next/link"

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

const TERMS = [
  { label: "Per deployment", desc: "Each licence covers your organisation's Veritas server and the number of monitored servers (agents) in your plan." },
  { label: "Signed and machine-bound", desc: "The licence file is signed by Veritas and tied to the fingerprint of the server it runs on." },
  { label: "Verified offline", desc: "The software checks the licence locally every time it starts. Nothing calls home." },
  { label: "Time-limited", desc: "Each licence has an expiry date and is renewed annually. The dashboard warns you before it ends." },
  { label: "Your data stays yours", desc: "A licence never gives Veritas access to your data or your servers." },
  { label: "Agreement terms", desc: "Your rights to install, use and copy the software are set out in your licence agreement." },
]

export default function LicensePage() {
  return (
    <SiteShell>
      

      <div className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">

          <FadeIn>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06] mb-5">LICENSE</span>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.02] mb-6">Software License</h1>
            <p className="text-sm text-white/60 leading-relaxed mb-10 max-w-xl">
              Veritas is commercial software, licensed to each customer for use on their own infrastructure. This page explains how licences work. The binding terms are the ones in your licence agreement.
            </p>
          </FadeIn>

          {/* What is permitted */}
          <FadeIn delay={80}>
            <div className="mb-10 p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11]">
              <h2 className="text-lg font-light mb-5">How Veritas is licensed</h2>
              <div className="space-y-4">
                {TERMS.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00cbaa] mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-0.5">{item.label}</div>
                      <div className="text-xs text-white/55 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="rounded-2xl border border-white/[0.09] bg-[#0e0f11] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
                <span className="text-xs text-white/55 tracking-widest uppercase">Getting a licence</span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  "Install Veritas on the server you will use",
                  "Run: sudo veritas fingerprint",
                  "Send the fingerprint to your Veritas contact",
                  "Receive your signed veritas.vlic file",
                  "Run: sudo veritas license /path/to/veritas.vlic",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-4">
                    <span className="font-pixel text-[10px] text-white/40 tracking-widest shrink-0 w-4">{i + 1}</span>
                    <span className="text-sm text-white/70">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Continuity */}
          <FadeIn delay={200}>
            <p className="mt-8 text-xs text-white/50 leading-relaxed">
              Veritas includes third-party open-source components, which remain under their own licences. Each release publishes a software bill of materials that lists them.
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book-demo"
                className="px-6 py-3 bg-[#eef35f] text-black font-medium text-xs rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center"
              >
                Request a Licence
              </Link>
              <Link href="/contact" className="px-6 py-3 border border-white/15 text-white/72 text-xs rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">
                Licensing questions? Contact Us
              </Link>
            </div>
          </FadeIn>

        </div>
      </div>
    </SiteShell>
  )
}

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

export default function LicensePage() {
  return (
    <SiteShell>
      

      <div className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">

          <FadeIn>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06] mb-5">LICENSE</span>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.02] mb-6">Commercial Software License</h1>
            <p className="text-base text-white/60 leading-relaxed mb-8">
              Veritas is <strong className="text-white/85">commercial software</strong>, not open source. It is distributed under a signed, per-machine licence. The following summarises what the licence permits and what it does not.
            </p>
          </FadeIn>

          {/* What is permitted */}
          <FadeIn delay={80}>
            <div className="mb-6 p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11]">
              <h2 className="text-lg font-light mb-4 text-[#00cbaa]">✓ What is permitted</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Internal use", desc: "Install and use Veritas on licensed machines for your organisation's internal DPDPA compliance purposes." },
                  { label: "Agent deployment", desc: "Deploy Veritas Agents to as many application servers as your licence permits." },
                  { label: "Dashboard access", desc: "All users within your organisation may access the dashboard under the user limit in your licence." },
                  { label: "Evidence export", desc: "Export signed PDF audit reports for regulators, auditors, and internal review." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-sm font-medium shrink-0 text-[#00cbaa]">✓</span>
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-0.5">{item.label}</div>
                      <div className="text-xs text-white/55">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* What is not permitted */}
          <FadeIn delay={120}>
            <div className="mb-6 p-6 rounded-2xl border border-red-500/10 bg-red-500/5">
              <h2 className="text-lg font-light mb-4 text-red-400">✕ What is not permitted</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Redistribution", desc: "You may not distribute, resell, or sublicence Veritas to third parties." },
                  { label: "Reverse engineering", desc: "You may not decompile, disassemble, or attempt to derive the source code." },
                  { label: "Unlicensed machines", desc: "Running Veritas on machines beyond your licensed count requires a licence upgrade." },
                  { label: "Competing products", desc: "You may not use Veritas to build a competing compliance product or service." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-sm font-medium shrink-0 text-red-400">✕</span>
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-0.5">{item.label}</div>
                      <div className="text-xs text-white/55">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* How licensing works */}
          <FadeIn delay={160}>
            <div className="mb-6 p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11]">
              <h2 className="text-lg font-light mb-4">How machine-bound licensing works</h2>
              <ol className="space-y-3">
                {[
                  "You install Veritas on your server and run `veritas fingerprint` to get a machine hash.",
                  "You share that hash with us. We issue a signed `.vlic` licence file tied to that machine.",
                  "You install the licence file. Veritas verifies it locally — no internet call needed at runtime.",
                  "Licences expire annually. Renewal sends a new `.vlic` for the same or updated machines.",
                  "If a server is replaced, contact us — we re-issue the licence for the new machine fingerprint.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xs font-mono text-white/35 shrink-0 mt-0.5">0{i + 1}</span>
                    <p className="text-sm text-white/65 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          {/* Continuity */}
          <FadeIn delay={200}>
            <div className="mb-6 p-6 rounded-2xl border border-amber-400/15 bg-amber-400/5">
              <h2 className="text-lg font-light mb-3 text-amber-300">Vendor continuity</h2>
              <p className="text-sm text-white/65 leading-relaxed mb-2">
                Veritas licences include a <strong className="text-white/80">90-day offline grace period</strong>. If Veritas ceases operations, your installed software will continue to function for 90 days after the last licence validity date, giving you time to migrate.
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Enterprise customers can request a source escrow arrangement. Contact us at{" "}
                <a href="mailto:hello@agentveritas.in" className="underline underline-offset-2 hover:text-white transition-colors">hello@agentveritas.in</a> to discuss.
              </p>
            </div>
          </FadeIn>

          {/* Copyright */}
          <FadeIn delay={240}>
            <p className="text-xs text-white/35 mb-8">
              © 2026 Veritas. All rights reserved. Veritas is commercial software. References to any GitHub repository are for documentation purposes only and do not constitute a grant of open-source rights.
            </p>
          </FadeIn>

          <FadeIn delay={280}>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book-demo"
                className="px-6 py-3 bg-[#eef35f] text-black font-medium text-xs rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center"
              >
                Book a Demo
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

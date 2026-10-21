"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
import { RevealText } from "@/components/reveal-text"
import { PixelIcon } from "@/components/pixel-icon"
import Link from "next/link"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={`rounded-2xl border border-white/[0.09] bg-[#0e0f11] overflow-hidden hover:border-white/[0.18] hover:bg-[#141617] transition-colors ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s` }}>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06]">{children}</span>
}

export default function AboutPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>ABOUT</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"Compliance,\nwithout compromise."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            Veritas began with India&apos;s Digital Personal Data Protection Act 2023 — a real, urgent compliance challenge with no good on-premise tooling to solve it. Veritas is commercial software built for engineering and compliance teams at Indian companies that process personal data.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8 pb-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <BentoCard className="p-10 md:p-14" delay={0}>
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 max-w-2xl">
              &ldquo;Every organisation processing personal data is now legally required to detect violations, maintain auditable records, and prove compliance. Doing this manually across hundreds of microservices is impossible. Veritas automates it &mdash; on your own infrastructure, with no raw personal data leaving your network. It is commercial software, not open source.&rdquo;
            </p>
          </BentoCard>
        </div>
      </section>

      {/* The problem we solve */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>THE PROBLEM WE SOLVE</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">
            {"Modern data protection law\nis not optional."}
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: "platform" as const,
                title: "The law requires detection",
                desc: "Data protection regulation mandates that data fiduciaries implement technical and organisational measures to prevent breaches and violations. Not knowing is not a defence.",
                delay: 0,
              },
              {
                icon: "workflow" as const,
                title: "Manual review does not scale",
                desc: "A mid-sized company with 10 services generates millions of log lines per day. No compliance team can manually review logs for personal data, purpose violations, and retention breaches in real time.",
                delay: 80,
              },
              {
                icon: "integrations" as const,
                title: "Generic tools need months of setup",
                desc: "SIEM tools and DLP products are not built for jurisdiction-specific rules like DPDPA purpose limitation, retention windows, or re-identification linkage detection. They require extensive custom configuration.",
                delay: 0,
              },
              {
                icon: "pricing" as const,
                title: "Regulators require tamper-evident proof",
                desc: "When a regulator asks how you know your data was handled correctly, you need more than a spreadsheet. You need a cryptographically verifiable audit record that proves no evidence was altered.",
                delay: 80,
              },
            ].map((item) => (
              <BentoCard key={item.title} className="p-8" delay={item.delay}>
                <div className="mb-4"><PixelIcon type={item.icon} size={32} /></div>
                <h3 className="text-lg font-light mb-4">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Design principles */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>DESIGN PRINCIPLES</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">{"How we built it."}</RevealText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                n: "01",
                icon: "agents" as const,
                title: "Everything stays inside your network",
                desc: "The Veritas Agent makes outbound calls only to the Veritas Server - within your infrastructure. The server has no outbound calls except the optional AI investigation, which sends no raw PII. Your compliance data is yours.",
                delay: 0,
              },
              {
                n: "02",
                icon: "workflow" as const,
                title: "No customer logic in code",
                desc: "Each organisation uploads a YAML config describing their data policy. The same server binary handles every customer. Config changes are versioned, so policy changes are themselves auditable.",
                delay: 80,
              },
              {
                n: "03",
                icon: "pricing" as const,
                title: "Tamper-evident by design",
                desc: "Every verdict links to the previous one via SHA-256 hash. This is not just logging - it is a cryptographic chain. If any record is altered, the chain breaks. Auditors can verify this themselves.",
                delay: 160,
              },
              {
                n: "04",
                icon: "platform" as const,
                title: "Honest about limitations",
                desc: "Veritas uses one server process and SQLite. It is suitable for pilots and mid-sized deployments. We document exactly where the limits are, and what needs to be added for horizontal scale.",
                delay: 0,
              },
              {
                n: "05",
                icon: "integrations" as const,
                title: "Built for real data structures",
                desc: "Aadhaar validation with Verhoeff checksum. PAN card structural rules. DPDPA section references in every verdict. Purpose limitation and linkage detection. Built for the actual requirements - not adapted from a generic tool.",
                delay: 80,
              },
              {
                n: "06",
                icon: "agents" as const,
                title: "Runs on what you already have",
                desc: "A spare VM or a Windows Server box. Veritas does not require cloud infrastructure or expensive hardware. The .deb, .pkg, and .exe installers get you running in under an hour.",
                delay: 160,
              },
            ].map((item) => (
              <BentoCard key={item.n} className="p-7" delay={item.delay}>
                <div className="mb-4"><PixelIcon type={item.icon} size={32} /></div>
                <div className="font-pixel text-[10px] text-white/35 tracking-widest mb-3">{item.n}</div>
                <h3 className="text-base font-light mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Technical status */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>PRODUCT STATUS</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-10">{"v1.0.16. Production-quality.\nHonest about what&apos;s next."}</RevealText>

          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="font-pixel text-[10px] text-[#00cbaa] tracking-widest mb-5">BUILT AND VERIFIED</div>
                <div className="space-y-2">
                  {[
                    "PII detection with custom recognizers",
                    "4 compliance rules (Exposure, Purpose, Retention, Linkage)",
                    "SHA-256 hash-chained evidence store",
                    "7-view investigation dashboard with WebSocket live feed",
                    "Agent registration, token auth, heartbeat, revoke",
                    "RSA-PSS machine-bound licensing (Linux v2 fingerprint)",
                    "RBAC (4 roles, server-enforced, tested)",
                    "Multi-organisation support",
                    "Linux .deb, macOS .pkg, Windows installer",
                    "Kubernetes DaemonSet agent",
                    "412 automated tests across Ubuntu, macOS, Windows CI",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <span className="text-[#00cbaa] shrink-0">+</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-amber-300 tracking-widest mb-5">IN PROGRESS / PLANNED</div>
                <div className="space-y-2">
                  {[
                    "Ingest queue and worker pool for high-throughput deployments",
                    "License portal hardening (fingerprint validation, row-level security)",
                    "macOS and Windows machine-id fingerprint parity with Linux v2",
                    "Offline hardening (bundle fonts and PDF library locally)",
                    "Simulated enterprise demo environment",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <span className="text-amber-300 shrink-0">·</span> {f}
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-5 rounded-xl border border-white/[0.09] bg-white/[0.04]">
                  <p className="text-xs text-white/60 leading-relaxed">
                    <span className="font-medium text-white/72">Known limitation:</span> Veritas uses a single server process and SQLite. It is well-suited for pilots and mid-sized deployments. For horizontal scale, the planned ingest queue and worker pool should be in place first.
                  </p>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>THE TEAM</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">
            {"Demo Gods"}
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard className="p-8" delay={0}>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-light shrink-0">✦</div>
                <div>
                  <p className="font-medium text-white/90 mb-1">[Founder name — update in about/page.tsx]</p>
                  <p className="text-sm text-white/50 mb-3">[Role] · <a href="#" className="underline underline-offset-2 hover:text-white/80 transition-colors">[LinkedIn]</a></p>
                  <p className="text-sm text-white/60 leading-relaxed">[Bio — update in about/page.tsx]</p>
                </div>
              </div>
            </BentoCard>
          </div>
          {/* Company details */}
          <BentoCard className="mt-6 p-8" delay={80}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Legal entity</div>
                <p className="text-sm text-white/70">[Company legal name — update here]</p>
              </div>
              <div>
                <div className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Registered address</div>
                <p className="text-sm text-white/70">[Address — update here]</p>
              </div>
              <div>
                <div className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Contact &amp; support</div>
                <p className="text-sm text-white/70"><a href="mailto:hello@agentveritas.in" className="underline underline-offset-2 hover:text-white transition-colors">hello@agentveritas.in</a></p>
                <p className="text-xs text-white/45 mt-1">We aim to respond within 1 business day.</p>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <Link href="/book-demo" className="flex-1 px-8 py-4 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center">BOOK A Demo</Link>
          <Link href="/contact" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">Contact Us</Link>
        </div>
      </section>
    </SiteShell>
  )
}

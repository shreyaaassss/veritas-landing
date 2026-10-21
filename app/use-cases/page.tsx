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
    <div ref={ref} className={`rounded-2xl border border-white/[0.09] bg-[#0e0f11] overflow-hidden ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06]">{children}</span>
}

const USE_CASES = [
  {
    tag: "FINTECH & BANKING",
    title: "KYC, Payments, and Lending Platforms",
    problem: "Fintech platforms handle Aadhaar, PAN, bank account numbers, and credit scores - the most sensitive personal data under DPDPA. A single debug log line that dumps a customer record is a high-severity data exposure violation.",
    capabilities: [
      "Aadhaar detection with Verhoeff checksum validation",
      "PAN card detection with structural validation",
      "Purpose limitation for KYC data vs. marketing systems",
      "Retention monitoring - KYC data has strict hold periods",
    ],
    scenario: "An order service fetches a customer record for a delivery address lookup. The debug log includes their Aadhaar number. Veritas detects this as a data exposure violation, records it in the evidence chain, and flags it live on the dashboard - before your compliance team's morning standup.",
    cta: "See how →",
    ctaHref: "/book-demo",
    delay: 0,
  },
  {
    tag: "HEALTHCARE & INSURANCE",
    title: "Patient and Policyholder Data",
    problem: "Health data is among the most sensitive categories under DPDPA 2023. Hospitals, diagnostic labs, and insurers process patient records across dozens of systems. Retention windows are strict and purpose limitation is closely regulated.",
    capabilities: [
      "Detection of health-related personal data in logs",
      "Retention alerts when patient records exceed the permitted storage window",
      "Purpose violation detection when health data appears in billing or analytics systems",
      "Re-identification risk from combined fields",
    ],
    scenario: "A diagnostics platform stores patient reports in its primary system (permitted) and automatically backs them up to an analytics warehouse (not declared in consent). Veritas fires a purpose violation when the analytics system sends log events containing patient identifiers.",
    cta: "See how →",
    ctaHref: "/book-demo",
    delay: 60,
  },
  {
    tag: "E-COMMERCE & LOGISTICS",
    title: "Customer and Delivery Data at Scale",
    problem: "E-commerce platforms process names, phone numbers, delivery addresses, and payment data for millions of customers across hundreds of services. Log volume is high and PII leaks into logs constantly without automated detection.",
    capabilities: [
      "High-throughput log scanning (agents on every service)",
      "Indian phone number detection in order and logistics logs",
      "Address and name detection in shipping APIs",
      "Kubernetes DaemonSet deployment for cluster-wide coverage",
    ],
    scenario: "A logistics API processes thousands of delivery records per hour. A developer adds a debug log that dumps the full customer object including phone and address. Veritas agents tail those logs and detect EXPOSURE_001 within seconds of the first log line being written.",
    cta: "See how →",
    ctaHref: "/book-demo",
    delay: 120,
  },
]

const FAQS = [
  {
    q: "Is Veritas a SaaS or on-premise product?",
    a: "Veritas is exclusively on-premise. You install the Veritas Server on a machine within your network. No data is sent to us. The only optional external call is the AI investigation feature, which sends field names and statute text  -  never raw PII.",
  },
  {
    q: "What Indian PII types does Veritas detect?",
    a: "Veritas detects Aadhaar (with Verhoeff checksum), PAN card, Indian phone numbers, names (via spaCy NER), email addresses, and locations/addresses. The detection engine runs fully locally  -  no API calls for PII detection.",
  },
  {
    q: "What are the four DPDPA rules Veritas enforces?",
    a: "EXPOSURE_001: personal data appearing where it must not (logs, API responses). PURPOSE_001: data used beyond its declared consent scope. RETENTION_001: data held past its permitted retention window. LINKAGE_001: individually harmless fields together enabling re-identification.",
  },
  {
    q: "Can I deploy Veritas on Kubernetes?",
    a: "Yes. The Veritas Agent ships as a Kubernetes DaemonSet  -  one agent per node, tailing logs and forwarding events locally to the Veritas Server. kubectl apply -f veritas-agent/k8s/ and your cluster is covered.",
  },
  {
    q: "How does the licensing work?",
    a: "Veritas requires a machine-bound RSA-PSS signed license file (.vlic). Install Veritas, run 'veritas fingerprint' to get your machine's hash, send it to us, and we issue a license. The license is verified locally on every startup  -  no call home required.",
  },
  {
    q: "What operating systems does Veritas support?",
    a: "The Veritas Server runs on Ubuntu 22.04+, macOS 12+ (Apple Silicon), and Windows 10/11/Server 2019+. The Veritas Agent runs on Ubuntu 18.04+ and any Linux. CI tests run on all three platforms.",
  },
  {
    q: "Does Veritas store raw PII?",
    a: "No. Veritas stores only masked snippets (e.g. [PHONE_REDACTED]), the rule that fired, the field name, the source system, severity, statute reference, and the hash chain. Raw PII values are never stored in the evidence database.",
  },
]

export default function UseCasesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>USE CASES</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"Who Veritas\nis built for."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            Any organisation processing Indian personal data under DPDPA 2023. These are the three industries where Veritas delivers immediate, measurable compliance value.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-8 pb-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-4">
          {USE_CASES.map((uc) => (
            <BentoCard key={uc.tag} className="p-8 md:p-10" delay={uc.delay}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">{uc.tag}</div>
                  <h2 className="text-2xl font-light mb-5 leading-snug">{uc.title}</h2>
                  <p className="text-sm text-white/65 leading-relaxed mb-6">{uc.problem}</p>
                  <div className="space-y-2">
                    {uc.capabilities.map(c => (
                      <div key={c} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="text-[#00cbaa] shrink-0 mt-0.5">✓</span> {c}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link href={uc.ctaHref} className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">{uc.cta}</Link>
                  </div>
                </div>
                <div>
                  <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">EXAMPLE SCENARIO</div>
                  <div className="p-6 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                    <p className="text-sm text-white/70 leading-relaxed italic">{uc.scenario}</p>
                  </div>
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Prerequisites */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>PREREQUISITES</Tag>
          <h2 className="mt-5 text-3xl font-light tracking-tight mb-10">What you need to get started.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BentoCard className="p-7" delay={0}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">VERITAS SERVER</div>
              <div className="space-y-3 text-sm text-white/70">
                {["One VM, server, or physical machine inside your network", "Ubuntu 22.04+, macOS 12+, or Windows 10/11", "2 GB RAM minimum (4 GB recommended)", "2 GB free disk space", "A Veritas license (.vlic file  -  issued by us after install)"].map(r => (
                  <div key={r} className="flex items-start gap-2.5"><span className="text-white/45 shrink-0">·</span>{r}</div>
                ))}
              </div>
            </BentoCard>
            <BentoCard className="p-7" delay={80}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">VERITAS AGENT</div>
              <div className="space-y-3 text-sm text-white/70">
                {["One agent per application server you want to monitor", "Ubuntu 18.04+ or any Linux; or Docker; or Kubernetes", "128 MB RAM per agent", "Outbound network access to the Veritas Server (port of your choice)", "A registration key (issued from the Veritas dashboard)"].map(r => (
                  <div key={r} className="flex items-start gap-2.5"><span className="text-white/45 shrink-0">·</span>{r}</div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>FAQ</Tag>
          <h2 className="mt-5 text-3xl font-light tracking-tight mb-10">Common questions.</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} className="rounded-2xl border border-white/[0.09] bg-[#0e0f11] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#141617] transition-colors"
                  >
                    <span className="text-sm font-light leading-snug pr-6">{faq.q}</span>
                    <span className="text-white/40 transition-transform duration-200 shrink-0" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </span>
                  </button>
                  <div style={{ maxHeight: isOpen ? "400px" : "0px", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                    <p className="px-6 pb-6 text-sm text-white/65 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <Link href="/book-demo" className="flex-1 px-8 py-4 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center">DISCUSS Your Use Case</Link>
          <Link href="/how-it-works" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">HOW It Works</Link>
        </div>
      </section>
    </SiteShell>
  )
}

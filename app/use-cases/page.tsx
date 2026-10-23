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
    problem: "Fintech platforms handle Aadhaar, PAN, bank details and credit decisions, some of the most sensitive personal data there is. A single debug line that dumps a customer record puts that data in a log file that many people can read.",
    capabilities: [
      "Aadhaar validated with the Verhoeff checksum and masked on the host",
      "PAN recognised by its structure",
      "KYC data flagged when it reaches a system not declared to hold it",
      "Retention reviews for data with strict holding periods",
    ],
    scenario: "A lending service fetches a customer record to check an address, and a debug line includes the Aadhaar number. The agent masks it before the line leaves the host, the finding joins an incident owned by the lending team, and the record is in the evidence chain before anyone opens the dashboard.",
    cta: "See how →",
    ctaHref: "/book-demo",
    delay: 0,
  },
  {
    tag: "HEALTHCARE & INSURANCE",
    title: "Patient and Policyholder Data",
    problem: "Hospitals, diagnostic labs and insurers move patient and policyholder records through many systems. Identifiers copied into an analytics warehouse or a billing system that was never declared to hold them are easy to miss and hard to explain later.",
    capabilities: [
      "Contact and identity details found in logs and API responses",
      "Data flagged in systems that the policy does not declare",
      "Retention reviews when records outlive their declared period",
      "Fields that identify a person together, caught in a single event",
    ],
    scenario: "A diagnostics platform keeps patient reports in its primary system, as declared, and a nightly job starts copying patient identifiers into an analytics service. Veritas raises a finding the first time that service handles them, names the field, and routes it to the data team.",
    cta: "See how →",
    ctaHref: "/book-demo",
    delay: 60,
  },
  {
    tag: "E-COMMERCE & LOGISTICS",
    title: "Customer and Delivery Data at Scale",
    problem: "E-commerce platforms process names, phone numbers, addresses and payment details for millions of customers across many services. Log volume is high, and personal data slips into it whenever a developer debugs a live issue.",
    capabilities: [
      "An agent on every service, or one per Kubernetes node",
      "Indian phone numbers found in order and delivery logs",
      "Card numbers masked at the agent",
      "Incidents that reopen when a removed debug line returns",
    ],
    scenario: "A delivery API handles thousands of orders an hour, and a developer adds a debug line that prints the customer object. Thousands of findings arrive and are grouped into one incident for the platform team. When the line is removed and later returns in a new release, the incident reopens on its own.",
    cta: "See how →",
    ctaHref: "/book-demo",
    delay: 120,
  },
]

const FAQS = [
  {
    q: "Is Veritas a SaaS or a self-hosted product?",
    a: "Self-hosted. You install the Veritas server on a machine inside your network and the agents on your application hosts. Nothing about your data is sent to us. Outside the server, only signed checkpoints go to the witnesses you choose, and they carry hashes rather than personal data.",
  },
  {
    q: "Which personal data does Veritas recognise?",
    a: "Aadhaar numbers (validated with the Verhoeff checksum), PAN, Indian phone numbers, email addresses and card numbers, in logs, API responses and new database columns. You can test any sample line in the Scan Sandbox before deploying.",
  },
  {
    q: "What does Veritas check?",
    a: "Whether personal data appears where it should not, whether it matches what your policy declares for each system, whether it is kept longer than declared, whether fields that identify a person travel together, whether an erased identifier comes back, and whether a current notice covers the data. Each rule is a technical signal, not a legal conclusion.",
  },
  {
    q: "How can an auditor check the evidence without trusting you?",
    a: "Every record is chained to the one before it, and signed checkpoints are kept by witnesses outside the server. The audit pack holds the evidence, the checkpoints, the public key and a stand-alone verifier that runs with no server and no network. It also states plainly what it does not prove.",
  },
  {
    q: "Can I deploy Veritas on Kubernetes?",
    a: "Yes. The agent ships with a Kubernetes manifest that runs one agent per node and forwards events to your Veritas server.",
  },
  {
    q: "How does licensing work?",
    a: "Install Veritas, run veritas fingerprint and send us the result. We issue a signed licence file bound to that machine. It is verified locally every time the service starts, with no call home.",
  },
  {
    q: "Does Veritas store raw personal data?",
    a: "No. Findings keep masked snippets, the rule that fired, the field, the system and the owning team. Rights lookups and erasure checks use keyed hashes, so the raw identifier is never stored.",
  },
  {
    q: "Does Veritas replace our DPO or legal counsel?",
    a: "No. Veritas gives your DPO, your lawyers and your engineering team evidence from the systems themselves. Decisions about the law stay with the people qualified to make them.",
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
            Any organisation that handles Indian personal data and needs to show what happened to it. These are the industries where Veritas fits most naturally.
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
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00cbaa] shrink-0 mt-2" /> {c}
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
                {["One VM, server or physical machine inside your network", "Ubuntu 22.04 or later, a Mac with Apple silicon, or Windows 10 or later", "2 GB RAM minimum, 4 GB recommended", "2 GB free disk space", "A Veritas licence file, issued for your machine after install"].map(r => (
                  <div key={r} className="flex items-start gap-2.5"><span className="text-white/45 shrink-0">·</span>{r}</div>
                ))}
              </div>
            </BentoCard>
            <BentoCard className="p-7" delay={80}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">VERITAS AGENT</div>
              <div className="space-y-3 text-sm text-white/70">
                {["One agent per application host or Kubernetes node you want to watch", "Linux, a Mac with Apple silicon, or Kubernetes", "About 128 MB of memory", "Network access to the Veritas server on the port you choose", "A one-time registration key from the Veritas dashboard"].map(r => (
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

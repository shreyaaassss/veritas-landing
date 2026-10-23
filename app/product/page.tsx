"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
import { RevealText } from "@/components/reveal-text"
import Link from "next/link"

function useInView(threshold = 0.1) {
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

function Dot({ color = "bg-white/25" }: { color?: string }) {
  return <div className={`w-1 h-1 rounded-full ${color} shrink-0`} />
}

const RULES = [
  {
    id: "EXPOSURE_001",
    title: "Personal data where it should not be",
    severity: "BY DATA KIND",
    when: "Personal data appears in a log, or in a system whose declaration allows only de-identified data.",
    example: "A support log line carries a phone number and an Aadhaar number. The finding names the system, the field and the owning team.",
  },
  {
    id: "PURPOSE_001",
    title: "Personal data without a matching declaration",
    severity: "BY DATA KIND",
    when: "A kind of personal data is observed in a system, database column or API field that the policy does not declare.",
    example: "A migration adds customers.aadhaar_no, or an API response starts returning items[].mobile. Each is raised with the field named.",
  },
  {
    id: "RETENTION_001",
    title: "Data held longer than declared",
    severity: "BY DATA KIND",
    when: "The policy declares how long a system may keep a kind of data, and that data is still being seen after the period ends.",
    example: "A system declared to keep phone numbers for 30 days still writes them months later. The owner receives a retention task to confirm.",
  },
  {
    id: "LINKAGE_001",
    title: "Fields that identify a person together",
    severity: "MEDIUM",
    when: "A single event carries every field of a combination that the policy names as identifying.",
    example: "Name, phone number and delivery address travel together in one event, even though none of them was flagged on its own.",
  },
  {
    id: "ERASURE_001",
    title: "An erased identifier appeared again",
    severity: "HIGH",
    when: "An identifier from a closed erasure request is observed again, matched by keyed hash.",
    example: "A phone number erased last week is written again by a support system, in a different format. The alert still fires.",
  },
  {
    id: "NOTICE_001",
    title: "Data without a current notice",
    severity: "MEDIUM",
    when: "A kind of personal data is seen in a system that no current notice recorded in the policy covers.",
    example: "The notice lists phone numbers, and e-mail addresses start appearing in the same system.",
  },
]

const SEVERITY_STYLE: Record<string, string> = {
  HIGH: "bg-red-500/10 text-red-400 border-red-400/25",
  MEDIUM: "bg-amber-400/10 text-amber-300 border-amber-400/20",
}

export default function ProductPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>PRODUCT</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"The evidence layer\nfor personal data."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            Self-hosted software for teams that handle Indian personal data. Veritas masks personal data where it is written, checks everything it sees against the policy you declared, turns findings into incidents with owners, and keeps a tamper-evident record that an outsider can verify on their own.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#0e0f11] border border-white/[0.09] text-sm text-white/72">Self-hosted</div>
            <div className="px-4 py-2 rounded-xl bg-[#0e0f11] border border-white/[0.09] text-sm text-white/72">Verifiable offline</div>
            <div className="px-4 py-2 rounded-xl bg-[#0e0f11] border border-white/[0.09] text-sm text-white/72">Linux · macOS · Windows</div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>RULES</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-6">{"Plain-language rules.\nGuarded changes."}</RevealText>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl mb-12">
            Each rule describes a possible control failure: a technical signal, not a legal conclusion. Core rules cannot be switched off. Severity can be raised freely and lowered only to the floor for the kind of data. Every change and every exception needs a second person&apos;s approval, and is recorded in the evidence chain.
          </p>

          <div className="space-y-3">
            {RULES.map((rule, i) => (
              <BentoCard key={rule.id} className="p-8 md:p-10" delay={i * 60}>
                <div className="flex items-start justify-between gap-6 mb-5">
                  <div className="flex items-center gap-4">
                    <code className="font-pixel text-[11px] text-white/50 tracking-widest">{rule.id}</code>
                    <h3 className="text-xl font-light">{rule.title}</h3>
                  </div>
                  <span className={`shrink-0 text-[10px] px-2.5 py-1 rounded-full border tracking-widest ${SEVERITY_STYLE[rule.severity] ?? "bg-white/[0.06] text-white/55 border-white/[0.1]"}`}>
                    {rule.severity}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">Fires when</div>
                    <p className="text-sm text-white/70 leading-relaxed">{rule.when}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">Example</div>
                    <p className="text-sm text-white/70 leading-relaxed">{rule.example}</p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detection and masking */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>DETECTION AND MASKING</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">{"Built for India's\npersonal data."}</RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BentoCard className="p-8" delay={0}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">WHERE IT LOOKS</div>
              <h3 className="text-lg font-light mb-4">Logs, API responses and database changes</h3>
              <p className="text-sm text-white/65 leading-relaxed mb-5">
                Agents read files, containers and syslog on each host, and the server accepts OpenTelemetry logs. A payload tap watches API responses inside your service, and schema watch reads database statement logs for new personal-data columns. Detection runs on your own server.
              </p>
              <div className="space-y-2">
                {[
                  "Mask, hash or drop each kind of personal data on the host",
                  "Fail closed: a line that cannot be masked is dropped, not sent",
                  "Keyed hashes for lookups, so raw identifiers are never stored",
                  "Scan Sandbox to test a sample line before you deploy",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/65">
                    <Dot />
                    {f}
                  </div>
                ))}
              </div>
            </BentoCard>

            <BentoCard className="p-8" delay={80}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">WHAT IT RECOGNISES</div>
              <div className="space-y-3">
                {[
                  { type: "Aadhaar", detail: "Validated with the Verhoeff checksum, which rejects most random twelve-digit numbers" },
                  { type: "PAN", detail: "Checked against the ten-character PAN structure" },
                  { type: "Indian phone", detail: "Indian mobile numbers, written with or without the country code" },
                  { type: "Email", detail: "Email addresses in free text and structured fields" },
                  { type: "Card numbers", detail: "Luhn-validated card numbers, masked at the agent" },
                ].map(item => (
                  <div key={item.type} className="pb-3 border-b border-white/[0.07] last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-pixel text-[10px] text-white/55 tracking-widest">{item.type.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Evidence and dashboard */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>EVIDENCE AND DASHBOARD</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">{"Evidence that stands\non its own."}</RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BentoCard className="p-8" delay={0}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">TAMPER-EVIDENT EVIDENCE</div>
              <h3 className="text-lg font-light mb-4">Chained, signed and witnessed</h3>
              <p className="text-sm text-white/65 leading-relaxed mb-5">
                Every record stores the hash of the one before it, so a changed record breaks the chain. Signed checkpoints of the chain go to witnesses you choose outside the server, so even someone who rewrites the whole database cannot hide it from the stand-alone verifier.
              </p>
              <div className="space-y-2">
                {[
                  "Separate chain for each organisation, encrypted at rest",
                  "Witnesses such as a separate folder, your SIEM or a time-stamp authority",
                  "Stand-alone verifier that needs no server and no network",
                  "Audit pack with the evidence, checkpoints, public key and verify scripts",
                  "A plain summary of what the pack proves and what it does not",
                  "Rule changes, approvals and incident updates recorded in the same chain",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/65">
                    <Dot color="bg-[#00cbaa]" /> {f}
                  </div>
                ))}
              </div>
            </BentoCard>

            <BentoCard className="p-8" delay={80}>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">THE DASHBOARD</div>
              <h3 className="text-lg font-light mb-4">Built for the people who answer for data</h3>
              <div className="space-y-3">
                {[
                  { view: "Overview", desc: "Findings, open incidents, system health and evidence anchoring at a glance" },
                  { view: "Audit Ledger", desc: "Incidents with owners, every finding behind them, chain checks and the audit pack" },
                  { view: "Data map", desc: "What each system was observed handling, set against the policy, with retention and notice reviews" },
                  { view: "Rights requests", desc: "Identifier lookups by keyed hash, a task for each system owner, and a signed record" },
                  { view: "Rules", desc: "Rules in force, proposed changes, approvals and exceptions" },
                  { view: "Agents", desc: "Registration keys, heartbeats, masking mode and instant revocation" },
                  { view: "Policy", desc: "Your declared data policy and its version history" },
                  { view: "Scan Sandbox", desc: "Test detection on a sample line before you deploy" },
                ].map(item => (
                  <div key={item.view} className="flex items-start gap-3">
                    <span className="font-pixel text-[9px] text-white/45 tracking-widest w-24 shrink-0">{item.view.toUpperCase()}</span>
                    <span className="text-xs text-white/65 leading-relaxed">{item.desc}</span>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Licensing */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>LICENSING</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">{"Machine-bound.\nVerified offline."}</RevealText>

          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-lg font-light mb-4">How Veritas licensing works</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-5">
                  Each licence is a signed file (<code className="bg-white/[0.07] px-1 rounded font-mono text-[10px]">.vlic</code>) that records your organisation, plan, expiry date and, optionally, the fingerprint of the machine it runs on. The product carries only the public key, and the signing key never leaves Veritas.
                </p>
                <div className="space-y-3 text-sm text-white/70">
                  {[
                    "No call home: the licence is checked locally every time the service starts",
                    "Machine-bound: a fingerprint ties the licence to your server",
                    "Stable fingerprints: renaming the machine or changing its network does not break the licence",
                    "Renewal: install a new licence file before the expiry date shown in the dashboard",
                    "Clear failure: an invalid or expired licence stops the service with a plain message",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="text-white/45 shrink-0 mt-0.5">·</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-light mb-4">Licence workflow</h3>
                <div className="space-y-4">
                  {[
                    { n: "1", step: "Install Veritas on your server" },
                    { n: "2", step: "Run: sudo veritas fingerprint" },
                    { n: "3", step: "Send the fingerprint to your Veritas contact" },
                    { n: "4", step: "Receive a signed veritas.vlic file" },
                    { n: "5", step: "Run: sudo veritas license /path/to/veritas.vlic" },
                    { n: "6", step: "The service starts and the dashboard is available" },
                  ].map(item => (
                    <div key={item.n} className="flex items-start gap-4">
                      <span className="font-pixel text-[10px] text-white/40 tracking-widest shrink-0 w-4">{item.n}</span>
                      <span className="text-sm text-white/70">{item.step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/book-demo" className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white tracking-widest transition-colors">
                    Request a licence →
                  </Link>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* What every deployment includes */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>INCLUDED</Tag>
          <h2 className="mt-5 text-3xl font-light tracking-tight mb-10">What every deployment includes.</h2>
          <BentoCard className="p-8" delay={0}>
            <div className="space-y-3">
              {[
                "Agents for Linux, macOS and Kubernetes, with masking at the source",
                "Server installers for Linux, macOS and Windows",
                "OpenTelemetry log and syslog ingestion",
                "Payload tap for API responses and schema watch for databases",
                "Pipeline gate that stops undeclared personal data in migrations and API specifications",
                "Plain-language rules with severity floors, time-bound exceptions and two-person approval",
                "Incidents with owners, recurrence detection and alerts",
                "Observed processing map, retention reviews and notice coverage",
                "Rights requests with per-system tasks and signed records",
                "Hash-chained evidence with signed checkpoints and independent witnesses",
                "Stand-alone verifier and one-click audit pack",
                "Draft breach report built from the evidence, for your DPO to complete",
                "Industry policy packs for fintech, health and e-commerce as a reviewed starting point",
                "Role-based access, multiple organisations, backups and restore",
                "Machine-bound licence verified offline",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.07] last:border-0">
                  <Dot color="bg-[#00cbaa]" />
                  <span className="text-sm text-white/72 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <Link href="/book-demo" className="flex-1 px-8 py-4 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center">BOOK A Demo</Link>
          <Link href="/how-it-works" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">HOW It Works</Link>
          <Link href="/documentation" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">INSTALLATION Guide</Link>
        </div>
      </section>
    </SiteShell>
  )
}

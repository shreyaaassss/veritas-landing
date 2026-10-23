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

const STEPS = [
  {
    n: "01",
    title: "Your application writes a log line",
    desc: "A support service logs a callback with the customer's phone number, Aadhaar number and email address. From its own point of view the application did nothing wrong, but the log file now holds personal data.",
    example: `2026-10-20 10:05:01 INFO ticket 5001 callback to 9876543210
  aadhaar 2345 6789 0124 mail asha.rao@example.com done`,
  },
  {
    n: "02",
    title: "The agent masks it on the host",
    desc: "The agent on that host reads the new line, masks the Aadhaar number and the email address, and replaces the phone number with a keyed hash. Only then does it forward the line, using its own token. If masking fails, the line is dropped rather than sent.",
    example: `ticket 5001 callback to [PHONE#69512b.92c8630586a3342e]
  aadhaar [AADHAAR_REDACTED] mail [EMAIL_REDACTED] done

POST /v1/acme_retail/events
Authorization: Bearer <agent-token>`,
  },
  {
    n: "03",
    title: "The server checks it against your policy",
    desc: "The server records which kinds of personal data the line carried and compares them with the policy you declared for that system: which data it may hold, for what purpose and for how long.",
    example: `system:        support-ticketing
kinds seen:    phone (hashed), aadhaar (masked), email (masked)
declared:      phone
not declared:  aadhaar, email`,
  },
  {
    n: "04",
    title: "Findings become one owned incident",
    desc: "Personal data in a log raises a finding, and so does data the system never declared. Findings with the same cause join a single incident, owned by the team you named for that system.",
    example: `EXPOSURE_001   personal data in a log
PURPOSE_001    aadhaar, email not declared here

INC-3          support-ticketing
owner:         Support team
status:        OPEN`,
  },
  {
    n: "05",
    title: "Everything goes into the evidence chain",
    desc: "Each finding, status change and rule approval is appended to the organisation's chain and linked to the record before it. At intervals, a signed checkpoint of the chain is copied to the witnesses you chose, outside the server.",
    example: `record:        11356
prev_hash:     4bca07…31c441
row_hash:      9f2c41…e8a71e
checkpoint:    signed, held by two witnesses`,
  },
  {
    n: "06",
    title: "The team resolves it, and anyone can check",
    desc: "The owner fixes the logging and resolves the incident. If the same line appears again, the incident reopens. When an auditor asks, the audit pack and the stand-alone verifier show that the records still match what was signed.",
    example: `INC-3:  OPEN → ACKNOWLEDGED → RESOLVED

$ veritas-verify --evidence evidence.jsonl \\
    --checkpoints checkpoints.jsonl --pubkey veritas.pub
PASS  organization acme_retail: 11356 records, 5 checkpoints`,
  },
]

export default function HowItWorksPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>HOW IT WORKS</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"One log line.\nMasked, judged,\nrecorded."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            The path of one piece of personal data: from a log line your application writes, to an incident with an owner, to evidence that an auditor can verify without asking us.
          </p>
        </div>
      </section>

      {/* Architecture overview */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>ARCHITECTURE</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-10">Runs inside your network. Verifies outside it.</h2>

          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="mb-4"><PixelIcon type="platform" size={32} /></div>
                <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">VERITAS SERVER</div>
                <h3 className="text-lg font-light mb-3">The evidence server</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-5">
                  Runs on one machine in your network. Receives events from agents and receivers, finds personal data, checks it against your declared policy, writes every result into the evidence chain, and serves the dashboard.
                </p>
                <div className="space-y-2">
                  {["Events from agents, OpenTelemetry logs and syslog", "Detection on your own hardware", "Rules checked against your declared policy", "Hash-chained evidence, encrypted at rest", "Signed checkpoints sent to witnesses you choose", "Dashboard with live updates", "Roles enforced on the server"].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-xs text-white/65">
                      <div className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4"><PixelIcon type="agents" size={32} /></div>
                <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">VERITAS AGENT</div>
                <h3 className="text-lg font-light mb-3">The agent on each host</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-5">
                  Runs beside your applications on each host or Kubernetes node. Reads log files, containers and syslog, masks, hashes or drops personal data before anything travels, and forwards events with its own token, buffering and retrying when the server is unreachable.
                </p>
                <div className="space-y-2">
                  {["Files, containers, syslog and database statement logs", "Masking at the source, fail-closed", "Per-agent token, revocable from the dashboard", "Bounded buffer with retry", "Linux and macOS packages, Kubernetes manifest", "About 128 MB of memory"].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-xs text-white/65">
                      <div className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network flow */}
            <div className="mt-10 pt-8 border-t border-white/[0.08]">
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">NETWORK FLOW: PERSONAL DATA STAYS INSIDE YOUR NETWORK</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/65">
                {["Your app servers", "→", "Veritas agent (masks)", "→", "Veritas server (your VM)", "→", "Evidence store (your disk)", "→", "Dashboard (your browser)"].map((item, i) => (
                  <span key={i} className={item === "→" ? "text-white/35" : "px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]"}>
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/50">
                Outside the server, only <span className="font-medium">signed checkpoints</span> go to the witnesses you choose. They carry hashes of the chain, never personal data.
              </p>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* The path of one event */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>THE PATH OF ONE EVENT</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-12">From log line to verified record.</h2>

          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <BentoCard key={step.n} className="p-8 md:p-10" delay={i * 60}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-pixel text-[11px] text-white/35 tracking-widest">{step.n}</span>
                      <h3 className="text-xl font-light">{step.title}</h3>
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="bg-[#141617] rounded-xl p-5">
                    <pre className="text-[11px] font-mono text-white/55 leading-relaxed whitespace-pre-wrap overflow-x-auto">{step.example}</pre>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Data policy */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>DATA POLICY</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-4">Describe your data policy once.</h2>
          <p className="mt-3 mb-10 text-sm text-white/60 max-w-xl leading-relaxed">
            Each organisation declares what personal data each system holds, why it holds it, who owns it and how long it may keep it. No code change or redeploy is needed. Industry policy packs give you a reviewed starting point instead of a blank page.
          </p>
          <BentoCard className="p-0 overflow-hidden" delay={0}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
              <span className="font-pixel text-[10px] text-white/45 tracking-widest">acme_retail_policy.yaml</span>
              <span className="text-[10px] text-white/40 tracking-widest">DATA POLICY</span>
            </div>
            <pre className="p-6 text-[12px] font-mono text-white/70 leading-relaxed overflow-x-auto whitespace-pre">{`org_id: acme_retail
fields:
  - field_name: phone
    pii_category: phone
    declared_purpose: order_fulfillment
    consent_scope: order_fulfillment
    retention_days: 1095
    source_system: order-service

  - field_name: aadhaar
    pii_category: aadhaar
    declared_purpose: onboarding_kyc
    consent_scope: onboarding_kyc
    retention_days: 180
    source_system: partner-service
    data_since: 2025-12-24            # the system already holds data from this date

owners:
  order-service:   { team: Orders, email: orders@acme.example }
  partner-service: { team: KYC, email: kyc@acme.example }

notices:
  - notice_id: n-core
    version: "3"
    data_categories: [phone]
    systems: ["*"]`}</pre>
          </BentoCard>
          <p className="mt-4 text-xs text-white/50 leading-relaxed">
            When you update the policy, the earlier version is kept with its timestamp, so you can show what the policy said at any point in time.
          </p>
        </div>
      </section>

      {/* Data lifecycle */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>DATA LIFECYCLE</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-10">What is stored. What is not.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BentoCard className="p-8" delay={0}>
              <div className="font-pixel text-[10px] text-[#00cbaa] tracking-widest mb-5">WHAT VERITAS STORES</div>
              <div className="space-y-3">
                {[
                  "The rule that fired, and why",
                  "The field and the system it came from",
                  "The owning team and the incident it belongs to",
                  "A masked snippet, with values replaced by placeholders such as [PHONE_REDACTED]",
                  "Keyed hashes for rights lookups and erasure checks",
                  "The hash chain and its signed checkpoints",
                  "Incident status, comments, and who changed what",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00cbaa] mt-2 shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </BentoCard>
            <BentoCard className="p-8" delay={80}>
              <div className="font-pixel text-[10px] text-red-400 tracking-widest mb-5">WHAT VERITAS NEVER STORES</div>
              <div className="space-y-3">
                {[
                  "Raw personal data values such as Aadhaar numbers, PAN or phone numbers",
                  "Complete raw log lines",
                  "Your application's source code or configuration",
                  "Agent secrets after registration",
                  "Anything on Veritas company servers: everything stays on your disk",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" /> {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-[#b6abff]/10 border border-[#b6abff]/25">
                <p className="text-xs text-[#b6abff] leading-relaxed">
                  <span className="font-medium">Leaving the server:</span> only signed checkpoints, sent to the witnesses you choose. They carry hashes of the chain, which let an outsider detect changes without seeing any personal data.
                </p>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Access control */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>ACCESS CONTROL</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-10">Roles, enforced on the server.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { role: "SUPER_ADMIN", icon: "platform" as const, desc: "Full access. Creates organisations and manages users and agents across organisations.", delay: 0 },
              { role: "COMPLIANCE_ADMIN", icon: "workflow" as const, desc: "Manages users, incidents and the data policy within an organisation, and proposes rule changes.", delay: 60 },
              { role: "AUDITOR", icon: "integrations" as const, desc: "Reviews incidents and evidence, checks the chain and downloads the audit pack. Cannot change configuration.", delay: 120 },
              { role: "VIEWER", icon: "pricing" as const, desc: "Read-only access to the dashboard and the Audit Ledger, for management and external reviewers.", delay: 180 },
            ].map((item) => (
              <BentoCard key={item.role} className="p-6" delay={item.delay}>
                <div className="mb-3"><PixelIcon type={item.icon} size={28} /></div>
                <div className="font-pixel text-[9px] text-white/45 tracking-widest mb-3">{item.role}</div>
                <p className="text-xs text-white/65 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/50">Role checks happen on the server, so a browser cannot grant itself more access by changing its requests. Rule changes take effect only after a second administrator approves them.</p>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <Link href="/documentation" className="flex-1 px-8 py-4 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center">
            Installation Guide
          </Link>
          <Link href="/book-demo" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">
            Book a Demo
          </Link>
          <Link href="/product" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">
            Product Details
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}

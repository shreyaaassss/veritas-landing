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

function Code({ children }: { children: React.ReactNode }) {
  return <code className="text-[11px] font-mono bg-white/[0.07] px-1.5 py-0.5 rounded text-white/72">{children}</code>
}

export default function HowItWorksPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>HOW IT WORKS</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"Every violation.\nDetected. Recorded.\nResolved."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            The complete path of a personal data violation  -  from a log line written by your application to a tamper-evident verdict in your compliance team&apos;s dashboard.
          </p>
        </div>
      </section>

      {/* Architecture overview */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>ARCHITECTURE</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-10">Two components. Everything inside your network.</h2>

          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="mb-4"><PixelIcon type="platform" size={32} /></div>
                <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">VERITAS SERVER</div>
                <h3 className="text-lg font-light mb-3">The compliance brain</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-5">
                  Runs on one machine in your network. Receives events from agents, detects PII, evaluates DPDPA rules, stores the evidence chain, and serves the investigation dashboard.
                </p>
                <div className="space-y-2">
                  {["Receives agent events via HTTP", "PII detection engine (Presidio + spaCy)", "DPDPA rule evaluation (4 rules)", "Append-only SHA-256 hash chain evidence store", "Investigation dashboard (WebSocket live feed)", "RBAC (4 roles)", "Optional LLM investigation"].map(f => (
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
                <h3 className="text-lg font-light mb-3">The lightweight forwarder</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-5">
                  Deployed on every application host or Kubernetes node. Tails log files and Docker container logs, forwards each line to the Veritas Server using a per-agent token, and buffers then retries when the server is unreachable.
                </p>
                <div className="space-y-2">
                  {["File and Docker log tailing", "Per-agent bearer token auth", "Retry with bounded buffer (survives server restarts)", "Docker image, .deb package, Kubernetes DaemonSet", "128 MB RAM", "Revocable from the dashboard instantly"].map(f => (
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
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">NETWORK FLOW  -  EVERYTHING STAYS INSIDE YOUR NETWORK</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/65">
                {["Your App Servers", "→", "Veritas Agent", "→", "Veritas Server (your VM)", "→", "Evidence Store (your disk)", "→", "Dashboard (your browser)"].map((item, i) => (
                  <span key={i} className={item === "→" ? "text-white/35" : "px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]"}>
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/50">
                Optional: AI investigation call → OpenAI / Anthropic / Local Ollama (sends <span className="font-medium">only field names + statute text</span>, never raw PII)
              </p>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* 6-step event path */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>THE PATH OF ONE EVENT</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-12">From log line to resolved case.</h2>

          <div className="space-y-4">
            {[
              {
                n: "01",
                title: "Application writes a log line",
                desc: "A debug message in your order service dumps a customer record. Your application is doing nothing wrong from its own perspective  -  but the log file now contains personal data.",
                example: `[2026-10-05T09:14:02Z] DEBUG order-service: fetched customer {\n  name: "Rohan Verma", phone: "9876543210", address: "Flat 4B, Pune"\n}`,
                delay: 0,
              },
              {
                n: "02",
                title: "Veritas Agent forwards the event",
                desc: "The agent is tailing that log file. It reads the new line and sends it to POST /v1/{org}/events on the Veritas Server, authenticated with its per-agent bearer token. If the server is unreachable, the agent buffers and retries automatically.",
                example: `POST /v1/acme_retail/events\nAuthorization: Bearer <agent-token>\n\n{"source": "order-service", "text": "[2026-10-05..."}`,
                delay: 60,
              },
              {
                n: "03",
                title: "PII detection engine runs",
                desc: "The server's detection pipeline scans the event text. It finds a name, a phone number, and an address. Validators eliminate false positives (e.g. Aadhaar Verhoeff checksum). Runs fully on your server - no external API call.",
                example: `Detected entities:\n  PERSON       → "Rohan Verma"      confidence: 0.92\n  IN_PHONE     → "9876543210"        confidence: 0.99\n  LOCATION     → "Flat 4B, Pune"     confidence: 0.87`,
                delay: 120,
              },
              {
                n: "04",
                title: "Rule engine evaluates the policy",
                desc: "The rule engine compares what was found against the organisation's declared policy (loaded from the org config YAML). The order-service field has declared_purpose: order_fulfillment  -  logging personal data is not in scope.",
                example: `Rule EXPOSURE_001 fired:\n  field:    phone\n  source:   order-service\n  severity: HIGH\n  reason:   "Personal data appeared in application logs.\n             Policy prohibits logging of phone field."\n  statute:  DPDPA 2023 § 8(3)`,
                delay: 180,
              },
              {
                n: "05",
                title: "Verdict stored in the evidence chain",
                desc: "The verdict is appended to the SHA-256 hash chain. It stores the previous verdict's hash and its own hash  -  making it mathematically impossible to alter the record without breaking the chain. The verdict is pushed to all connected compliance browsers via WebSocket.",
                example: `verdict_id:    VRD-20241005-00431\nprev_hash:     sha256(VRD-00430)\nown_hash:      sha256(prev_hash + verdict_payload)\nchain_valid:   true\nstatus:        OPEN`,
                delay: 240,
              },
              {
                n: "06",
                title: "Compliance team investigates and resolves",
                desc: "The violation appears live in the dashboard's Live Stream. A compliance officer opens the case, optionally asks the AI investigation panel 'why is this a violation?' (the LLM receives only rule text and field name  -  no raw PII), adds a comment, and moves the case to RESOLVED. The full audit trail is exportable as a tamper-evident PDF.",
                example: `Case lifecycle:\n  OPEN → [investigated, AI explanation, comment added]\n  → ACKNOWLEDGED → [developer fixes the logging]\n  → RESOLVED\n\nPDF report exported. Chain hash verified.`,
                delay: 300,
              },
            ].map((step) => (
              <BentoCard key={step.n} className="p-8 md:p-10" delay={step.delay}>
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

      {/* Org config */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>ORG CONFIG</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-4">Describe your data policy in YAML.</h2>
          <p className="mt-3 mb-10 text-sm text-white/60 max-w-xl leading-relaxed">
            Each organisation uploads a YAML config describing what personal data each system holds, why it holds it, and how long it may retain it. No code change or redeploy needed. Updating the policy creates a versioned file  -  so policy changes are themselves auditable.
          </p>
          <BentoCard className="p-0 overflow-hidden" delay={0}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
              <span className="font-pixel text-[10px] text-white/45 tracking-widest">acme_retail_config.yaml</span>
              <span className="text-[10px] text-white/40 tracking-widest">ORG CONFIG</span>
            </div>
            <pre className="p-6 text-[12px] font-mono text-white/70 leading-relaxed overflow-x-auto whitespace-pre">{`org_id: acme_retail
fields:
  - field_name: phone
    pii_category: phone
    declared_purpose: order_fulfillment
    consent_scope: order_fulfillment
    retention_days: 1095              # 3 years from consent
    source_system: order-service

  - field_name: aadhaar
    pii_category: aadhaar
    declared_purpose: onboarding_kyc
    consent_scope: onboarding_kyc
    retention_days: 180
    source_system: partner-service
    data_since: 2025-12-24            # system already holds data from this date

linkage_rules:
  - fields: [name, phone, delivery_address]  # together they identify a person`}</pre>
          </BentoCard>
          <p className="mt-4 text-xs text-white/50 leading-relaxed">
            When you update this config, the old version is kept. Every version is timestamped and auditable  -  your compliance team can prove what your policy was at any point in time.
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
                  "The rule that fired (e.g. EXPOSURE_001)",
                  "The field name that triggered it (e.g. 'phone')",
                  "The source system (e.g. 'order-service')",
                  "Severity and DPDPA statute reference",
                  "A masked snippet  -  PII values are replaced with [PHONE_REDACTED]",
                  "The verdict hash chain (SHA-256)",
                  "Case status: OPEN / ACKNOWLEDGED / RESOLVED",
                  "Compliance team comments and timestamps",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="text-[#00cbaa] mt-0.5 shrink-0">✓</span> {item}
                  </div>
                ))}
              </div>
            </BentoCard>
            <BentoCard className="p-8" delay={80}>
              <div className="font-pixel text-[10px] text-red-400 tracking-widest mb-5">WHAT VERITAS NEVER STORES</div>
              <div className="space-y-3">
                {[
                  "Raw PII values (Aadhaar numbers, PAN, phone numbers, names)",
                  "Complete log lines (only masked snippets)",
                  "Your application's source code or configuration",
                  "Agent authentication secrets after registration",
                  "Any data on Veritas servers  -  everything is on your disk",
                  "Anything that crosses your network boundary (except optional LLM call)",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span> {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-[#b6abff]/10 border border-[#b6abff]/25">
                <p className="text-xs text-[#b6abff] leading-relaxed">
                  <span className="font-medium">Optional LLM call:</span> If you enable AI investigation, the model receives <Code>rule_id</Code>, <Code>field_name</Code>, and <Code>statute_text</Code> only. No raw PII is ever sent.
                </p>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* RBAC */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>ACCESS CONTROL</Tag>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight mb-10">Four roles. Server-enforced.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { role: "SUPER_ADMIN", icon: "platform" as const, desc: "Full access. Creates organisations, manages users and agents across all orgs.", delay: 0 },
              { role: "COMPLIANCE_ADMIN", icon: "workflow" as const, desc: "Manages users and cases within their organisation. Uploads and updates the org config.", delay: 60 },
              { role: "AUDITOR", icon: "integrations" as const, desc: "Investigates, acknowledges, and resolves cases. Can export evidence. Cannot change configuration.", delay: 120 },
              { role: "VIEWER", icon: "pricing" as const, desc: "Read-only access to the dashboard and audit ledger. For management and external auditors.", delay: 180 },
            ].map((item) => (
              <BentoCard key={item.role} className="p-6" delay={item.delay}>
                <div className="mb-3"><PixelIcon type={item.icon} size={28} /></div>
                <div className="font-pixel text-[9px] text-white/45 tracking-widest mb-3">{item.role}</div>
                <p className="text-xs text-white/65 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/50">Role checks are enforced server-side. The browser cannot grant itself elevated access by changing its request.</p>
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

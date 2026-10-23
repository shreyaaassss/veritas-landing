"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
import { RevealText } from "@/components/reveal-text"
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

function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
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

const ERRORS = [
  {
    code: "SERVICE_STOPS_AFTER_INSTALL",
    severity: "info",
    desc: "veritas status shows that the service is not running right after installation.",
    fix: "This is expected until a licence is installed. Run sudo veritas logs to see what is missing, then install your licence with sudo veritas license /path/to/veritas.vlic.",
  },
  {
    code: "LICENCE_INVALID_OR_EXPIRED",
    severity: "error",
    desc: "The service stops with a licence message, or the dashboard banner warns that the licence ends soon.",
    fix: "Run sudo veritas check. A licence is bound to one machine's fingerprint, so a new machine needs a new licence: send its fingerprint to your Veritas contact. Renew before the expiry date shown in the dashboard.",
  },
  {
    code: "DASHBOARD_DOES_NOT_LOAD",
    severity: "error",
    desc: "The browser cannot reach https://your-server:8000.",
    fix: "Run veritas status, then sudo veritas logs. Another program using port 8000 stops Veritas from starting.",
  },
  {
    code: "AGENT_DOES_NOT_APPEAR",
    severity: "warning",
    desc: "The agent is running but never shows up under Agents.",
    fix: "Registration keys work once and expire after 30 minutes, so issue a fresh key if needed. Check veritas_address and registration_key in /etc/veritas-agent/config.yaml, and read sudo veritas-agent logs. On macOS, give the agent access to each log file with sudo veritas-agent grant-read.",
  },
  {
    code: "AGENT_CERTIFICATE_ERROR",
    severity: "warning",
    desc: "The agent log shows TLS or certificate errors when it connects.",
    fix: "Run sudo veritas-agent fetch-cert https://your-server:8000 to fetch the server certificate, or pin it with ca_cert in the agent config.",
  },
  {
    code: "AGENT_DROPPED_LINES",
    severity: "warning",
    desc: "The Agents page shows dropped lines for an agent.",
    fix: "Each agent keeps a bounded buffer. When the server cannot keep up with a burst, the oldest lines are dropped and counted. Give the server more detection capacity, such as cores and memory, and check its System Health panel.",
  },
  {
    code: "UNANCHORED_TAIL",
    severity: "info",
    desc: "veritas-verify reports that the latest records are not covered by a signed checkpoint.",
    fix: "Records written after the last checkpoint are not covered yet. Wait for the next checkpoint, or trigger one, then export and verify again.",
  },
  {
    code: "CHECKPOINT_HEAD_MISMATCH",
    severity: "error",
    desc: "veritas-verify reports that the evidence does not match a signed checkpoint: records up to that point were altered or replaced.",
    fix: "Treat this as a security incident. If you restored a backup, the restore itself is recorded, so check the audit log first. Otherwise keep the evidence and the witnesses' copies as they are, and contact us.",
  },
]

const GOOD_TO_KNOW = [
  {
    title: "Detection is probabilistic",
    desc: "A finding is evidence that something looked like personal data, not a legal finding. Some numbers in log lines, such as batch or tenant numbers, can resemble phone numbers.",
    action: "Test sample lines in the Scan Sandbox, and record a time-bound exception for known false positives.",
  },
  {
    title: "The verifier covers records up to the last checkpoint",
    desc: "Records written after the most recent signed checkpoint are not yet covered by a signature.",
    action: "Keep anchoring on with at least one witness, and verify after the next checkpoint.",
  },
  {
    title: "The data map shows what was observed",
    desc: "It reflects the data Veritas received, not every system or field that exists.",
    action: "Connect agents to every system you want covered, and declare the rest in your policy.",
  },
  {
    title: "Agents read new lines",
    desc: "When an agent starts, it reads lines written from that moment on, not the history already in the file.",
    action: "Start the agent before the activity you want to capture.",
  },
]

export default function TroubleshootingPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <SiteShell>
      

      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <Tag>TROUBLESHOOTING</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl font-light tracking-tight leading-[1.02]">
            {"Common problems\nand fixes."}
          </RevealText>
          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-xl">
            If Veritas is not behaving as expected, this guide covers the most common problems, their causes and how to resolve them.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 pb-20 space-y-12">

        {/* Problems */}
        <section>
          <h2 className="text-2xl font-light mb-6">Common problems</h2>
          <div className="space-y-3">
            {ERRORS.map((err) => {
              const isOpen = expanded === err.code
              const severityColor = err.severity === "error" ? "text-red-400 bg-red-500/10 border-red-400/25" : err.severity === "warning" ? "text-amber-300 bg-amber-400/10 border-amber-400/20" : "text-[#b6abff] bg-[#b6abff]/10 border-[#b6abff]/25"
              return (
                <BentoCard key={err.code} className="overflow-visible" delay={0}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : err.code)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <code className="text-[11px] font-mono text-white/65 bg-white/[0.06] px-2.5 py-1 rounded-lg">{err.code}</code>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityColor} tracking-widest uppercase`}>{err.severity}</span>
                    </div>
                    <span className="text-white/40 transition-transform duration-200" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? "400px" : "0px" }}>
                    <div className="px-6 pb-6 space-y-3">
                      <div>
                        <div className="text-[10px] text-white/45 tracking-widest uppercase mb-1.5">What you see</div>
                        <p className="text-sm text-white/70 leading-relaxed">{err.desc}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/45 tracking-widest uppercase mb-1.5">How to fix</div>
                        <p className="text-sm text-white/70 leading-relaxed">{err.fix}</p>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              )
            })}
          </div>
        </section>

        {/* Good to know */}
        <section>
          <h2 className="text-2xl font-light mb-3">Good to know</h2>
          <p className="text-sm text-white/60 mb-6">Behaviour worth understanding before you rely on the evidence.</p>
          <div className="space-y-3">
            {GOOD_TO_KNOW.map((item, i) => (
              <BentoCard key={i} className="p-7" delay={i * 40}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-base font-light">{item.title}</h3>
                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/55 border border-white/[0.1] tracking-widest uppercase">Note</span>
                </div>
                <p className="text-sm text-white/65 leading-relaxed mb-3">{item.desc}</p>
                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <span className="text-[10px] text-white/45 tracking-widest uppercase">What to do: </span>
                  <span className="text-xs text-white/65">{item.action}</span>
                </div>
              </BentoCard>
            ))}
          </div>
        </section>

        {/* Debug tips */}
        <section>
          <h2 className="text-2xl font-light mb-6">Debug tips</h2>
          <BentoCard className="p-8" delay={0}>
            <div className="space-y-5">
              {[
                { tip: "Check the service", detail: "veritas status shows whether the service is running and healthy, and sudo veritas logs streams its log." },
                { tip: "Run the health checks", detail: "sudo veritas check runs the product's own checks, including the licence." },
                { tip: "Read the System Health panel", detail: "The Overview shows the evidence store, agents, licence, certificate, disk space and evidence anchoring at a glance." },
                { tip: "Send a support bundle", detail: "sudo veritas support-bundle writes one ZIP with the diagnostics your Veritas contact needs." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-5 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="w-1 bg-white/10 rounded-full shrink-0 self-stretch" />
                  <div>
                    <div className="text-sm font-light mb-1.5">{item.tip}</div>
                    <p className="text-xs text-white/60 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </section>

        {/* Still stuck */}
        <div className="pt-6 border-t border-white/[0.08]">
          <p className="text-sm text-white/60 mb-4">Still stuck? We&apos;re happy to help.</p>
          <div className="flex gap-3">
            <Link href="/contact" className="px-6 py-3 bg-[#eef35f] text-black font-medium text-xs rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em]">Contact Us</Link>
            <a href="https://github.com/shreyaaassss/Veritas/issues" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/15 text-white/72 text-xs rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em]">OPEN An Issue ↗</a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <Link href="/documentation/user-guide" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">← User Guide</Link>
          <Link href="/documentation" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">All docs →</Link>
        </div>
      </div>
    </SiteShell>
  )
}

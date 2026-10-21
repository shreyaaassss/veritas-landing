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

export default function SecurityPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>SECURITY</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"Security posture."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            Veritas is a self-hosted tool. Security is a core design principle. Here is an honest account of where we are today.
          </p>
          <div className="mt-6 p-5 rounded-2xl border border-[#00cbaa]/20 bg-[#00cbaa]/5">
            <p className="text-sm text-[#00cbaa] leading-relaxed">
              <span className="font-medium">v1.0.16 · Production-ready:</span> The core detection engine, hash chain, RBAC and licensing have all passed 412 automated tests across Ubuntu, macOS and Windows CI. Active hardening is in progress on the items listed below.
            </p>
          </div>
        </div>
      </section>

      {/* What we do today */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Tag>WHAT WE DO TODAY</Tag>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Security measures\ncurrently in place."}
            </RevealText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: "Automatic secret redaction",
                desc: "API keys, tokens, passwords, and any field names you specify in the redact config are replaced with [REDACTED] before any log is written. Sensitive values are never stored, even temporarily.",
                status: "available",
                delay: 0,
              },
              {
                title: "Execution isolation",
                desc: "Each agent run is isolated from other runs. There is no cross-contamination of session state between concurrent executions.",
                status: "available",
                delay: 80,
              },
              {
                title: "Access boundary enforcement",
                desc: "Agents can only call tools explicitly granted to them. Unauthorized tool attempts are blocked and logged with type: access_denied.",
                status: "beta",
                delay: 0,
              },
              {
                title: "Open source codebase",
                desc: "The entire Veritas codebase is open source and publicly auditable on GitHub. You can review every line of code that handles your data.",
                status: "available",
                delay: 80,
              },
              {
                title: "No external data transmission",
                desc: "By default, Veritas does not transmit any agent data to external servers. All audit logs are written locally. Your data stays in your environment.",
                status: "available",
                delay: 0,
              },
              {
                title: "Dependency auditing",
                desc: "We run automated dependency audits on every commit using GitHub Dependabot. Known vulnerabilities in dependencies are addressed promptly.",
                status: "beta",
                delay: 80,
              },
            ].map((item) => (
              <BentoCard key={item.title} className="p-8" delay={item.delay}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-light">{item.title}</h3>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border tracking-widest ${item.status === "available" ? "bg-[#00cbaa]/10 text-[#00cbaa] border-[#00cbaa]/25" : "bg-amber-400/10 text-amber-300 border-amber-400/20"}`}>
                    {item.status === "available" ? "Active" : "Beta"}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* What we don't claim */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Tag>HONEST LIMITATIONS</Tag>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"What we do not\nclaim today."}
            </RevealText>
          </div>
          <BentoCard className="p-8 md:p-10" delay={0}>
            <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-2xl">
              We do not make security claims we cannot support. The following are not currently in place for Veritas:
            </p>
            <div className="space-y-5">
              {[
                { label: "SOC 2 Type II", note: "We have not undergone a SOC 2 audit. This is a planned milestone for a future version of Veritas when it reaches production-readiness." },
                { label: "HIPAA / ISO 27001", note: "No compliance certifications are held. Veritas should not be used to process PHI or other regulated data until we can support these requirements." },
                { label: "Penetration testing", note: "We have not conducted a formal third-party penetration test. This is planned before a v1.0 release." },
                { label: "Bug bounty program", note: "No formal bug bounty program is in place yet. We encourage responsible disclosure via the contact form (see below)." },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-5 pb-5 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 shrink-0 w-44">
                    <span className="text-sm text-red-400">✗</span>
                    <span className="text-sm font-light text-white/80">{item.label}</span>
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Responsible disclosure */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Tag>RESPONSIBLE DISCLOSURE</Tag>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Found a vulnerability?"}
            </RevealText>
          </div>
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  If you discover a security vulnerability in Veritas, please report it responsibly. We aim to respond to security reports within 48 hours and to have a fix or mitigation in place within 7 days for critical issues.
                </p>
                <div className="space-y-4">
                  <div className="text-[10px] text-white/45 tracking-widest uppercase">How to report</div>
                  <ol className="space-y-3">
                    {[
                      "Use the contact form with subject line: Security Issue",
                      "Include a description of the vulnerability and steps to reproduce",
                      "Do not publicly disclose until we have had a chance to respond",
                      "We will credit you in the security advisory (if you wish)",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <span className="font-pixel text-[10px] text-white/35 tracking-widest shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/contact" className="px-8 py-4 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center">
                  Report a Vulnerability
                </Link>
                <a
                  href="https://github.com/shreyaaassss/Veritas/security/advisories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center"
                >
                  View Security Advisories ↗
                </a>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs text-white/50 leading-relaxed">Expected response time: 48 hours for initial acknowledgement, 7 days for critical issues.</p>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Evidence integrity */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06] mb-5">EVIDENCE INTEGRITY</span>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-10">What tamper-evident means — and what it does not.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BentoCard className="p-8" delay={0}>
              <div className="font-pixel text-[10px] text-[#00cbaa] tracking-widest mb-4">WHAT THE HASH CHAIN PROVES</div>
              <p className="text-sm text-white/65 leading-relaxed mb-4">
                Every verdict in Veritas is linked to the previous one by a SHA-256 hash. This creates a chain: if any record in the middle is altered, the chain breaks and verification fails. Auditors can verify the chain themselves at any time from the dashboard.
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                It proves <strong className="text-white/80">internal consistency</strong> — that no record was silently edited after the fact.
              </p>
            </BentoCard>
            <BentoCard className="p-8" delay={80}>
              <div className="font-pixel text-[10px] text-amber-300 tracking-widest mb-4">CURRENT LIMITATION</div>
              <p className="text-sm text-white/65 leading-relaxed mb-4">
                The hash chain is stored on the same server it monitors. A user with direct database access could in principle rebuild the entire chain. This is a known limitation we document honestly.
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Mitigations: strict RBAC (database access is not part of any dashboard role), audit-log exports to an external system, and external timestamp anchoring is on the roadmap.
              </p>
            </BentoCard>
          </div>
          <div className="mt-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <p className="text-xs text-white/50 leading-relaxed">
              <strong className="text-white/70">Responsible disclosure:</strong> Found a security issue? Email <a href="mailto:security@agentveritas.in" className="underline underline-offset-2 hover:text-white transition-colors">security@agentveritas.in</a>. We aim to acknowledge within 48 hours and resolve critical issues within 7 days. A machine-readable <a href="/.well-known/security.txt" className="underline underline-offset-2 hover:text-white transition-colors">security.txt</a> is available.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

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
            Veritas watches personal data, so it is built to hold as little of it as possible. This page sets out the controls in place today, and the assurances we do not yet claim.
          </p>
          <div className="mt-6 p-5 rounded-2xl border border-amber-400/20 bg-amber-400/10">
            <p className="text-sm text-amber-300 leading-relaxed">
              <span className="font-medium">Pilot programme:</span> Veritas is deployed with customers in supervised pilots. Where an assurance is not yet in place, we say so below.
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
                title: "Masking at the source",
                desc: "Agents mask, hash or drop personal data on the host before a line is sent. If masking fails for a line, that line is dropped rather than sent raw.",
                delay: 0,
              },
              {
                title: "No raw values in the evidence store",
                desc: "Findings keep masked snippets and keyed hashes. Rights lookups and erasure checks work on keyed hashes, so a raw identifier is never stored.",
                delay: 80,
              },
              {
                title: "Tamper-evident evidence",
                desc: "Records are hash-chained and encrypted at rest. Signed checkpoints are held by witnesses outside the server, and a stand-alone verifier detects changes even when someone recomputes every hash.",
                delay: 0,
              },
              {
                title: "Access control and approvals",
                desc: "Roles are enforced on the server. Rule changes and exceptions need a second person's approval, and administrative actions are written to an audit log.",
                delay: 80,
              },
              {
                title: "Encrypted transport, offline licence",
                desc: "Dashboard and agent traffic use TLS, and agents can pin the server's certificate. The machine-bound licence is verified locally, with no call home.",
                delay: 0,
              },
              {
                title: "Signed releases and supply-chain checks",
                desc: "Release checksums are signed and every release ships a software bill of materials. Dependencies and code are scanned for known vulnerabilities and leaked secrets on every change.",
                delay: 80,
              },
            ].map((item) => (
              <BentoCard key={item.title} className="p-8" delay={item.delay}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-light">{item.title}</h3>
                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full border tracking-widest bg-[#00cbaa]/10 text-[#00cbaa] border-[#00cbaa]/25">
                    Active
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
              We do not make security claims we cannot support. The following are not in place for Veritas today:
            </p>
            <div className="space-y-5">
              {[
                { label: "SOC 2 Type II", note: "We have not completed a SOC 2 audit." },
                { label: "ISO 27001", note: "We do not hold an ISO 27001 certification." },
                { label: "Penetration testing", note: "No independent third-party penetration test has been completed yet." },
                { label: "Installer signing", note: "The macOS and Windows installers are not yet signed by the operating system vendors. Release checksums are signed, so you can verify each download before installing it." },
                { label: "Legal advice", note: "Veritas produces technical evidence. It is not legal advice and does not certify compliance with any law." },
                { label: "Bug bounty", note: "There is no paid bug bounty programme. We welcome responsible disclosure through the contact form, as described below." },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-5 pb-5 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="flex items-center gap-2.5 shrink-0 w-44">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
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
                  If you discover a security vulnerability in Veritas, please report it responsibly. We aim to acknowledge security reports within 48 hours and to have a fix or mitigation in place within 7 days for critical issues.
                </p>
                <div className="space-y-4">
                  <div className="text-[10px] text-white/45 tracking-widest uppercase">How to report</div>
                  <ol className="space-y-3">
                    {[
                      "Use the contact form with the subject line: Security Issue",
                      "Include a description of the vulnerability and the steps to reproduce it",
                      "Do not disclose it publicly until we have had a chance to respond",
                      "We will credit you in the security advisory, if you wish",
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
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-10">What tamper-evident means, and what it does not.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BentoCard className="p-8" delay={0}>
              <div className="font-pixel text-[10px] text-[#00cbaa] tracking-widest mb-4">WHAT THE EVIDENCE PROVES</div>
              <p className="text-sm text-white/65 leading-relaxed mb-4">
                Every record in Veritas is linked to the previous one by a SHA-256 hash, so a record altered in the middle breaks the chain. Auditors can verify the chain themselves at any time from the dashboard.
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                On its own, the chain proves <strong className="text-white/80">internal consistency</strong>: that no record was silently edited. Signed checkpoints held by independent witnesses, checked with the stand-alone verifier, extend that to records up to the last checkpoint.
              </p>
            </BentoCard>
            <BentoCard className="p-8" delay={80}>
              <div className="font-pixel text-[10px] text-amber-300 tracking-widest mb-4">LIMITS TO KNOW</div>
              <p className="text-sm text-white/65 leading-relaxed mb-4">
                Someone with direct access to the database could rebuild the whole chain, and the dashboard's own check would still pass. Only the witnesses' signed checkpoints and the stand-alone verifier expose that, so anchoring with at least one witness should be on.
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Records written after the last checkpoint are not yet covered by a signature. The audit pack states what it does not prove.
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

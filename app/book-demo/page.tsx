"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
import { RevealText } from "@/components/reveal-text"
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

export default function BookDemoPage() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "", useCase: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Name is required"
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid work email required"
    if (!form.org.trim()) e.org = "Organisation is required"
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm rounded-xl border ${errors[field] ? "border-red-400/50 bg-red-500/10" : "border-white/[0.14] bg-[#0e0f11]"} focus:outline-none focus:border-white/35 transition-colors placeholder:text-white/40`

  return (
    <SiteShell>
      

      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: info */}
            <div>
              <Tag>BOOK A DEMO</Tag>
              <RevealText className="mt-5 text-5xl md:text-6xl font-light tracking-tight leading-[1.02]">
                {"See Veritas\ndetect a real\nDPDPA violation."}
              </RevealText>
              <p className="mt-7 text-base text-white/60 leading-relaxed">
                In a 20-minute live walkthrough, we&apos;ll deploy Veritas in a demo environment, trigger a real DPDPA violation, and show you the full path from log line to resolved audit case.
              </p>

              <div className="mt-10 space-y-5">
                <div className="font-pixel text-[10px] text-white/45 tracking-widest uppercase">WHAT THE DEMO COVERS</div>
                {[
                  { n: "01", label: "Agent deployment", desc: "We deploy the Veritas Agent and it begins tailing simulated application logs immediately." },
                  { n: "02", label: "Live violation detection", desc: "A log line containing an Aadhaar number triggers EXPOSURE_001. You see it appear on the Live Stream in real time." },
                  { n: "03", label: "Evidence chain", desc: "We open the Audit Ledger and verify the SHA-256 hash chain on the spot." },
                  { n: "04", label: "Investigation workflow", desc: "Open the case, ask the AI panel 'why is this a DPDPA violation?', annotate, and resolve it." },
                  { n: "05", label: "PDF audit report", desc: "Export a tamper-evident compliance report  -  the kind an auditor or regulator would accept." },
                ].map(item => (
                  <div key={item.n} className="flex items-start gap-4">
                    <span className="font-pixel text-[10px] text-white/35 tracking-widest shrink-0">{item.n}</span>
                    <div>
                      <div className="text-sm font-light mb-1">{item.label}</div>
                      <p className="text-xs text-white/55 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 rounded-2xl border border-white/[0.09] bg-[#0e0f11]">
                <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-3">WHAT TO EXPECT AFTER SUBMITTING</div>
                <p className="text-sm text-white/65 leading-relaxed">
                  We&apos;ll reach out within 1–2 business days to schedule a time. Demos are conducted over video call (~20 minutes). We&apos;ll prepare a demo environment tailored to your industry and use case.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div>
              {submitted ? (
                <div className="rounded-2xl border border-[#00cbaa]/25 bg-[#00cbaa]/10 p-10 text-center">
                  <div className="text-4xl mb-4">✓</div>
                  <h3 className="text-xl font-light mb-3">Request received.</h3>
                  <p className="text-sm text-white/65 leading-relaxed mb-6">
                    We&apos;ll reach out to <span className="font-medium text-white/80">{form.email}</span> within 1–2 business days to schedule your demo.
                  </p>
                  <Link href="/" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">← Back to home</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.1] bg-[#0e0f11] p-8 shadow-sm space-y-5">
                  <h2 className="text-xl font-light mb-2">Request a demo</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/55 tracking-widest uppercase mb-1.5">Full Name *</label>
                      <input className={inputClass("name")} placeholder="Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-white/55 tracking-widest uppercase mb-1.5">Work Email *</label>
                      <input type="email" className={inputClass("email")} placeholder="priya@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/55 tracking-widest uppercase mb-1.5">Organisation *</label>
                    <input className={inputClass("org")} placeholder="Acme Fintech Pvt. Ltd." value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} />
                    {errors.org && <p className="text-xs text-red-400 mt-1">{errors.org}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-white/55 tracking-widest uppercase mb-1.5">Your Role</label>
                    <select className={`${inputClass("role")} appearance-none`} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="">Select a role</option>
                      <option>Data Protection Officer (DPO)</option>
                      <option>Compliance Officer</option>
                      <option>CTO / Engineering Lead</option>
                      <option>Security / Risk</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/55 tracking-widest uppercase mb-1.5">Primary Use Case</label>
                    <select className={`${inputClass("useCase")} appearance-none`} value={form.useCase} onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))}>
                      <option value="">Select one</option>
                      <option>DPDPA compliance monitoring</option>
                      <option>Audit readiness / evidence for regulators</option>
                      <option>PII leak detection in production logs</option>
                      <option>Purpose limitation enforcement</option>
                      <option>Evaluating for a client deployment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/55 tracking-widest uppercase mb-1.5">Anything specific you&apos;d like to see?</label>
                    <textarea rows={3} className={`${inputClass("message")} resize-none`} placeholder="E.g. 'We handle Aadhaar and PAN data in our KYC service and want to see how EXPOSURE_001 fires in that scenario.'" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] disabled:opacity-60 transition-all tracking-[0.012em]"
                  >
                    {submitting ? "Sending request…" : "Request Demo →"}
                  </button>

                  <p className="text-[11px] text-white/45 text-center leading-relaxed">
                    We&apos;ll reach out within 1–2 business days. We do not share your information with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

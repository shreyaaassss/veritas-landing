"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, BarChart3, Blocks, Check, ChevronDown, FileText, GraduationCap, Handshake, Key, LifeBuoy, Loader2, Minus,
  Server, ShieldCheck, Workflow, X,
} from "lucide-react"
import { Reveal, SiteShell } from "@/components/site-shell"
import { supabase } from "@/lib/supabase"

// ─── Claim your licence modal ─────────────────────────────────────────────────
function ClaimLicenceModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"signin" | "details">("signin")
  const [signingIn, setSigningIn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ org: "", role: "", servers: "", usecase: "" })
  const [error, setError] = useState("")

  const handleGoogle = async () => {
    setSigningIn(true)
    setError("")
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/pricing` },
    })
    if (err) { setError("Couldn't start Google sign-in. Please try again."); setSigningIn(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.org.trim() || !form.role.trim()) { setError("Organisation name and your role are required."); return }
    setSubmitting(true)
    setError("")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch("/api/claim-licence", {
        method: "POST",
        headers: { "content-type": "application/json", ...(session ? { authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please email hello@agentveritas.in directly.")
    } finally {
      setSubmitting(false)
    }
  }

  const field = (label: string, key: keyof typeof form, placeholder: string, required = false, type = "text") => (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-cloud)", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: "var(--color-live-wire)", marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        required={required}
        style={{
          background: "var(--color-graphite)", border: "1px solid var(--color-ash)", borderRadius: 8,
          padding: "10px 14px", fontSize: 14, color: "#fff", outline: "none", width: "100%", boxSizing: "border-box" as const,
        }}
        onFocus={e => (e.target.style.borderColor = "var(--color-live-wire)")}
        onBlur={e => (e.target.style.borderColor = "var(--color-ash)")}
      />
    </div>
  )

  return (
    <div className="tg-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }} role="dialog" aria-modal="true" aria-label="Claim your licence">
      <div className="tg-modal" style={{ width: "min(520px, 100%)" }}>

        {/* Header */}
        <div className="tg-modal-head">
          <span className="tg-modal-icon"><Key /></span>
          <div style={{ flex: 1 }}>
            <p className="tg-modal-title">Claim your licence</p>
            <p className="tg-modal-sub">{tab === "signin" ? "Sign in to continue" : "Tell us about your organisation"}</p>
          </div>
          <button className="tg-modal-x" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        {/* Tab pills */}
        {!submitted && (
          <div style={{ display: "flex", gap: 4, padding: "0 24px 16px", borderBottom: "1px solid var(--color-graphite)" }}>
            {(["signin", "details"] as const).map((t, i) => (
              <button
                key={t}
                onClick={() => tab === "details" && setTab(t)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
                  borderRadius: 50, border: "none", cursor: tab === "details" ? "pointer" : "default",
                  background: tab === t ? "var(--color-live-wire)" : "var(--color-graphite)",
                  color: tab === t ? "#000" : "var(--color-cloud)",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", transition: "all 0.2s",
                }}
              >
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: tab === t ? "rgba(0,0,0,0.2)" : "var(--color-ash)",
                  display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</span>
                {t === "signin" ? "Sign in" : "Your details"}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="tg-modal-body" style={{ padding: "20px 24px" }}>

          {/* ─ Tab 1: Sign in ─ */}
          {tab === "signin" && !submitted && (
            <div style={{ display: "grid", gap: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-cloud)", lineHeight: 1.6 }}>
                Sign in with Google to claim your Veritas licence. We&#39;ll collect your organisation
                details on the next step and follow up within 1 business day.
              </p>
              <button
                onClick={handleGoogle}
                disabled={signingIn}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  padding: "12px 20px", borderRadius: 10, border: "1px solid var(--color-ash)",
                  background: "var(--color-graphite)", color: "#fff", fontSize: 14, fontWeight: 500,
                  cursor: signingIn ? "not-allowed" : "pointer", opacity: signingIn ? 0.6 : 1, width: "100%",
                }}
              >
                {signingIn
                  ? <><Loader2 size={16} style={{ animation: "tg-spin 1s linear infinite" }} /> Redirecting…</>
                  : <><svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"/></svg> Continue with Google</>
                }
              </button>
              <p style={{ fontSize: 12, color: "var(--color-fog)", margin: 0, textAlign: "center" }}>
                Already have a licence key?{" "}
                <button onClick={() => setTab("details")} style={{ background: "none", border: "none", color: "var(--color-live-wire)", cursor: "pointer", fontSize: 12, padding: 0, textDecoration: "underline" }}>
                  Skip to org details
                </button>
              </p>
            </div>
          )}

          {/* ─ Tab 2: Org details ─ */}
          {tab === "details" && !submitted && (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
              {field("Organisation name", "org", "Acme Fintech Pvt. Ltd.", true)}
              {field("Your role", "role", "CTO, DPO, Head of Engineering…", true)}
              {field("Estimated server / agent count", "servers", "e.g. 5 servers")}
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-cloud)", letterSpacing: "0.04em" }}>Use case</label>
                <textarea
                  value={form.usecase}
                  onChange={e => setForm(f => ({ ...f, usecase: e.target.value }))}
                  placeholder="Briefly describe what you need Veritas for…"
                  rows={3}
                  style={{
                    background: "var(--color-graphite)", border: "1px solid var(--color-ash)", borderRadius: 8,
                    padding: "10px 14px", fontSize: 14, color: "#fff", outline: "none", width: "100%",
                    resize: "vertical", boxSizing: "border-box" as const, fontFamily: "inherit",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--color-live-wire)")}
                  onBlur={e => (e.target.style.borderColor = "var(--color-ash)")}
                />
              </div>
              {error && <p style={{ margin: 0, fontSize: 13, color: "#ff8a80" }}>{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="tg-btn tg-btn-primary"
                style={{ justifyContent: "center", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? <><Loader2 size={16} style={{ animation: "tg-spin 1s linear infinite" }} /> Sending…</> : <>Send request <ArrowRight size={16} /></>}
              </button>
              <p style={{ fontSize: 12, color: "var(--color-fog)", margin: 0 }}>
                We&#39;ll follow up at your sign-in email within 1 business day.
              </p>
            </form>
          )}

          {/* ─ Success ─ */}
          {submitted && (
            <div style={{ display: "grid", gap: 16, textAlign: "center", padding: "8px 0 16px" }}>
              <div style={{ fontSize: 15, letterSpacing: "0.14em", color: "var(--color-live-wire)" }}>DONE</div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#fff" }}>Request received</p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-cloud)", lineHeight: 1.6 }}>
                We&#39;ll review your details and follow up within 1 business day at the email you used to sign in.
                In the meantime, feel free to <Link href="/book-demo" style={{ color: "var(--color-live-wire)" }}>book a demo</Link>.
              </p>
              <button className="tg-btn tg-btn-white" onClick={onClose} style={{ justifyContent: "center" }}>Close</button>
            </div>
          )}

          {error && tab === "signin" && <p style={{ margin: "12px 0 0", fontSize: 13, color: "#ff8a80" }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

// Tiers, limits and prices follow "Veritas: Business and Revenue Model" (sections 7 and 8).
// Agents are the only enforced limit; log volume is a fair-use guide.

type Tier = {
  name: string
  forWho: string
  price: string
  unit: string
  note?: string
  featured?: boolean
  limits: string[]
  features: { label: string; included: boolean }[]
  cta: { label: string; href: string }
}

const TIERS: Tier[] = [
  {
    name: "Pilot",
    forWho: "First evaluation on your own logs",
    price: "₹10k",
    unit: "for 60 to 90 days",
    note: "Credited to your annual licence if you convert",
    limits: ["Up to 3 agents", "Up to 5 users", "1 organisation", "Small log volume"],
    features: [
      { label: "All rules, evidence chain and audit pack", included: true },
      { label: "AI-assisted investigation", included: true },
      { label: "Manual backups and chain verification", included: true },
      { label: "Email support", included: true },
      { label: "Self-serve onboarding", included: true },
    ],
    cta: { label: "Start a pilot", href: "/book-demo" },
  },
  {
    name: "Starter",
    forWho: "Small teams getting started",
    price: "₹12k",
    unit: "per month, billed annually",
    limits: ["Up to 3 agents", "Up to 5 users", "1 organisation", "About 10 GB/month log volume analysed"],
    features: [
      { label: "All rules, evidence chain and audit pack", included: true },
      { label: "AI-assisted investigation", included: false },
      { label: "Manual backups and chain verification", included: true },
      { label: "Email support, best effort", included: true },
      { label: "Self-serve docs", included: true },
    ],
    cta: { label: "Book a Demo", href: "/book-demo" },
  },
  {
    name: "Professional",
    forWho: "Growing compliance teams",
    price: "₹33k",
    unit: "per month, billed annually",
    featured: true,
    limits: ["Up to 15 agents", "Up to 25 users", "1 organisation", "About 50 GB/month log volume analysed"],
    features: [
      { label: "All rules, evidence chain and audit pack", included: true },
      { label: "AI-assisted investigation", included: true },
      { label: "Scheduled backups and chain verification", included: true },
      { label: "Email support, next business day", included: true },
      { label: "Guided setup call", included: true },
    ],
    cta: { label: "Book a Demo", href: "/book-demo" },
  },
  {
    name: "Enterprise",
    forWho: "Broad coverage, regulated sectors",
    price: "Contact us",
    unit: "Customizable plan, multi-year options",
    limits: ["40+ agents, custom", "Unlimited users", "Multiple organisations", "Custom log volume"],
    features: [
      { label: "All rules, evidence chain and audit pack", included: true },
      { label: "AI-assisted investigation, with local-model setup", included: true },
      { label: "Scheduled and custom backups", included: true },
      { label: "Named contact and SLA", included: true },
      { label: "Policy mapping included", included: true },
    ],
    cta: { label: "Talk to us", href: "/contact" },
  },
]

const COMPARE: { row: string; cells: [string, string, string, string] }[] = [
  { row: "For", cells: ["First evaluation", "Small teams getting started", "Growing compliance teams", "Broad coverage, regulated sectors"] },
  { row: "Length", cells: ["60 to 90 days", "Annual", "Annual", "Annual, multi-year options"] },
  { row: "Agents (enforced limit)", cells: ["Up to 3", "Up to 3", "Up to 15", "40+, custom"] },
  { row: "Log volume analysed (fair-use guide)", cells: ["Small", "About 10 GB/month", "About 50 GB/month", "Custom"] },
  { row: "Organisations", cells: ["1", "1", "1", "Multiple"] },
  { row: "Users", cells: ["Up to 5", "Up to 5", "Up to 25", "Unlimited"] },
  { row: "All rules, evidence chain and audit pack", cells: ["Yes", "Yes", "Yes", "Yes"] },
  { row: "AI-assisted investigation", cells: ["Yes", "No", "Yes", "Yes, with local-model setup"] },
  { row: "Backups and chain verification", cells: ["Manual", "Manual", "Scheduled", "Scheduled and custom"] },
  { row: "Support", cells: ["Email", "Email, best effort", "Email, next business day", "Named contact and SLA"] },
  { row: "Onboarding", cells: ["Self-serve", "Self-serve docs", "Guided setup call", "Policy mapping included"] },
  { row: "Price", cells: ["₹10k, credited if you convert", "₹12k / month", "₹33k / month", "Contact us, customizable"] },
]

const LIMITS = [
  { icon: Server, title: "Agents are the real limit", body: "Each plan covers a number of monitored servers (agents), capped in your signed licence. Add more in blocks of 10 at any time." },
  { icon: BarChart3, title: "Log volume is a guide, not a cap", body: "Log volume analysed is a fair-use guideline. A usage meter in the dashboard warns you at 80%, and we talk about the right plan at renewal." },
  { icon: ShieldCheck, title: "Monitoring never stops", body: "Veritas never pauses because a quota is reached. A compliance tool with blind spots is a liability, so detection always keeps running." },
]

const ADD_ONS = [
  { icon: Workflow, title: "Onboarding and policy mapping", price: "One-time, about ₹50k to ₹1.5 lakh", body: "We list the personal data each system holds and turn it into your organisation config: fields, purposes, consent scope and retention." },
  { icon: LifeBuoy, title: "Support and SLA upgrades", price: "About 10 to 20% of licence value", body: "Faster response times, a named contact and scheduled health checks." },
  { icon: Blocks, title: "Extra agent blocks", price: "Pro-rated from your tier price", body: "More agents beyond your plan's limit, sold in blocks of 10, without changing tier." },
  { icon: FileText, title: "Annual compliance health report", price: "Fixed fee per report", body: "A yearly review of findings, trends and recommendations, written for your DPO or board." },
  { icon: GraduationCap, title: "Training and workshops", price: "Per session", body: "Sessions for developers on keeping personal data out of logs, and for compliance teams on using the dashboard." },
  { icon: Handshake, title: "Partner programme", price: "15 to 25% referral margin", body: "For compliance consultants, CA and law firms and managed security providers who bring us customers." },
]

const ROADMAP = ["Slack alerts", "Single sign-on", "Remediation hints", "Managed service", "Hosted lite version"]

const FAQ = [
  { q: "How is Veritas priced?", a: "A monthly price based on how many servers (agents) you monitor, billed annually. Licences are signed files that expire on a date, so you renew once a year, which fits how compliance budgets already work." },
  { q: "Why start with a paid pilot?", a: "A 60 to 90 day pilot runs Veritas on your own logs, so you see real findings from your systems before committing. The pilot fee is credited against your first annual licence if you convert." },
  { q: "What happens if we go over the log volume guide?", a: "Nothing stops. Log volume is a fair-use guideline, not a hard limit. The dashboard shows a usage meter and warns at 80%, and we discuss the right plan at renewal." },
  { q: "We need more agents mid-year. What then?", a: "Add extra agents in blocks of 10, pro-rated from your tier price, without changing plan." },
  { q: "Does licensing need an internet connection?", a: "No. Veritas runs entirely on your infrastructure and the licence file is verified offline. Licences are machine-bound and renewed annually." },
  { q: "Are these final prices?", a: "They are indicative. Your quote depends on the number of agents and the onboarding scope you need. Book a demo or talk to us for an exact figure." },
]

export default function PricingPage() {
  const [claimOpen, setClaimOpen] = useState(false)
  return (
    <SiteShell>
      {/* ── Hero ── */}
      <section className="tg-section tg-price-hero">
        <div className="tg-container">
          <span className="tg-pill">Monthly pricing · priced by monitored servers</span>
          <h1 className="tg-display">Pricing that grows with <span className="tg-wire">your servers.</span></h1>
          <p className="tg-body">
            Pay a monthly price for the number of servers Veritas monitors. Everything runs on your own infrastructure, and every plan includes the full detection engine, all four DPDPA rules and <span className="tg-violet">tamper-evident evidence.</span>
          </p>
          <div className="tg-hero-meta">
            <span><i />Billed annually</span>
            <span><i />Start with a paid pilot</span>
            <span><i />Pilot fee credited on conversion</span>
          </div>
        </div>
      </section>

      {/* ── Claim your licence ── */}
      <section style={{ padding: "40px 0 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--color-fog)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Ready to get started?</p>
        <button
          id="claim-licence-btn"
          onClick={() => setClaimOpen(true)}
          className="tg-btn tg-btn-primary"
          style={{ fontSize: 15, padding: "12px 28px", borderRadius: 50 }}
        >
          Claim your licence <ArrowRight size={16} />
        </button>
      </section>

      {/* Modal */}
      {claimOpen && <ClaimLicenceModal onClose={() => setClaimOpen(false)} />}

      {/* ── Tiers ── */}
      <section className="tg-price-tiers-wrap">
        <div className="tg-container">
          <div className="tg-tiers">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} className={`tg-tier${t.featured ? " featured" : ""}`} delay={i * 70}>
                <div className="tg-tier-head">
                  <h2 className="tg-title">{t.name}</h2>
                  {t.featured && <span className="tg-tier-badge">Most popular</span>}
                </div>
                <p className="tg-body-sm">{t.forWho}</p>
                <div className="tg-tier-price">
                  <strong>{t.price}</strong>
                  <span>{t.unit}</span>
                </div>
                {t.note && <p className="tg-tier-note">{t.note}</p>}
                <Link href={t.cta.href} className={`tg-btn ${t.featured || t.name === "Pilot" ? "tg-btn-primary" : "tg-btn-white"}`}>
                  {t.cta.label} <ArrowRight />
                </Link>
                <ul className="tg-tier-limits">
                  {t.limits.map(l => <li key={l}>{l}</li>)}
                </ul>
                <ul className="tg-tier-features">
                  {t.features.map(f => (
                    <li key={f.label} className={f.included ? undefined : "off"}>
                      {f.included ? <Check /> : <Minus />}
                      <span>{f.label}{f.included ? "" : " (not included)"}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <p className="tg-caption tg-price-fine">Indicative monthly prices, billed annually. Your quote depends on the number of agents and the onboarding scope.</p>
        </div>
      </section>

      {/* ── How limits work ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">How limits work</span>
            <h2 className="tg-h2">One hard limit. No blind spots.</h2>
          </Reveal>
          <div className="tg-cols-3">
            {LIMITS.map((l, i) => {
              const Icon = l.icon
              return (
                <Reveal key={l.title} className="tg-feature" delay={i * 80}>
                  <span className="ic"><Icon /></span>
                  <h3 className="tg-title">{l.title}</h3>
                  <p className="tg-body">{l.body}</p>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Compare ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Compare plans</span>
            <h2 className="tg-h2">Everything in each plan, side by side.</h2>
          </Reveal>
          <p className="tg-caption tg-swipe-hint">Swipe sideways to compare all four plans →</p>
          <Reveal className="tg-compare-wrap">
            <table className="tg-compare">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {TIERS.map(t => <th key={t.name} scope="col" className={t.featured ? "featured" : undefined}>{t.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(r => (
                  <tr key={r.row}>
                    <th scope="row">{r.row}</th>
                    {r.cells.map((c, i) => (
                      <td key={i} className={TIERS[i].featured ? "featured" : undefined}>
                        {c === "Yes" ? <Check aria-label="Yes" className="yes" /> : c === "No" ? <Minus aria-label="No" className="no" /> : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Add-ons and services</span>
            <h2 className="tg-h2">Help where you need it.</h2>
            <p className="tg-body">The hardest step is mapping what personal data each system holds. We can do it with you, and support you as you grow.</p>
          </Reveal>
          <div className="tg-addons">
            {ADD_ONS.map((a, i) => {
              const Icon = a.icon
              return (
                <Reveal key={a.title} className="tg-addon" delay={(i % 3) * 70}>
                  <span className="ic"><Icon /></span>
                  <h3 className="tg-title">{a.title}</h3>
                  <span className="tg-addon-price">{a.price}</span>
                  <p className="tg-body-sm">{a.body}</p>
                </Reveal>
              )
            })}
          </div>
          <Reveal className="tg-roadmap">
            <span className="tg-caption">On the roadmap, not yet available</span>
            <div>{ROADMAP.map(r => <span key={r} className="tg-chip">{r}</span>)}</div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="tg-section">
        <div className="tg-container tg-faq-wrap">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Pricing FAQ</span>
            <h2 className="tg-h2">Common questions.</h2>
          </Reveal>
          <div className="tg-faq">
            {FAQ.map(f => (
              <details key={f.q}>
                <summary>{f.q}<ChevronDown /></summary>
                <p className="tg-body">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tg-cta">
        <div className="tg-container">
          <h2 className="tg-h2">Start with a pilot<br />on your own logs.</h2>
          <p className="tg-body" style={{ maxWidth: 520 }}>60 to 90 days, real findings from your systems, and the fee is credited if you convert.</p>
          <div className="tg-hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/book-demo" className="tg-btn tg-btn-primary">Start a pilot <ArrowRight /></Link>
            <Link href="/contact" className="tg-btn tg-btn-text">Talk to us <ArrowRight /></Link>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

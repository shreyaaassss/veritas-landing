"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Boxes, Check, ChevronRight, Clock3, FileWarning, Fingerprint, LayoutDashboard, Link2,
  Lock, ScanSearch, Search, Server, ShieldCheck, Sparkles, Target,
} from "lucide-react"
import { DownloadButtons } from "@/components/download-buttons"
import { Reveal, SiteShell } from "@/components/site-shell"

// ─── Content ──────────────────────────────────────────────────────────────────
const PROBLEMS = [
  { icon: FileWarning, title: "Personal data leaks into logs", lead: "A debug line dumps a customer record.", rest: " Without automated scanning, you'll never know  -  until an auditor finds it." },
  { icon: Target, title: "Data used beyond declared purpose", lead: "Purpose limitation violated silently.", rest: " An API call accesses fields your privacy policy doesn't permit for that service." },
  { icon: Clock3, title: "Retention windows exceeded", lead: "Every day is a fresh violation.", rest: " Data from 3 years ago sits in a system that's only allowed to keep it for 6 months." },
]

const RULES = [
  { title: "Data Exposure", severity: "HIGH", label: "Personal data in logs, debug output, API responses" },
  { title: "Purpose Violation", severity: "HIGH", label: "Data used outside its declared consent scope" },
  { title: "Retention Exceeded", severity: "MEDIUM", label: "Held past the permitted retention window" },
  { title: "Re-identification Risk", severity: "MEDIUM", label: "Harmless fields that together identify a person" },
]

const CASES = [
  { icon: FileWarning, title: "Aadhaar number in application logs", meta: "payments-api · 14:02 · OPEN" },
  { icon: Target, title: "KYC data read by marketing-sync", meta: "marketing-sync · 13:31 · ACKNOWLEDGED" },
  { icon: Clock3, title: "Retention window exceeded", meta: "crm-sync · 11:20 · RESOLVED" },
]

const AUDIENCES = [
  { icon: LayoutDashboard, label: "Compliance Officer", title: "Live violation detection", desc: "Every DPDPA violation appears on your dashboard the moment it's detected — via WebSocket live feed. Open a case, investigate with AI-assisted explanations, annotate, and resolve. Full case lifecycle in one view.", badges: ["Live Stream", "Case lifecycle"] },
  { icon: Link2, label: "DPO / Auditor", title: "Tamper-evident evidence chain", desc: "Every verdict is linked by SHA-256 hash to the previous one. The chain can be verified at any time — proving no record was altered. Export a signed PDF audit report for regulators on demand.", badges: ["Hash chain", "PDF export"] },
  { icon: Boxes, label: "Engineering Team", title: "Agent deployment and monitoring", desc: "Deploy the Veritas Agent as a Docker container, .deb package, or Kubernetes DaemonSet. Each agent appears with a heartbeat status. Revoke any agent instantly from the dashboard.", badges: ["Docker", "Kubernetes DaemonSet"] },
  { icon: Lock, label: "CTO / Security", title: "No raw personal data leaves your network", desc: "Everything runs on your infrastructure — server, evidence store, dashboard. No log data or personal data is transmitted to us. RBAC with 4 server-enforced roles. TLS by default. Machine-bound licence verified offline.", badges: ["On-premise", "RBAC"] },
]

type CodeLine = { t: "c" | "cmd" | "out" | "ok" | "url" | "gap" | "plain"; s?: string } | { t: "prop"; k: string; v: string }
const INSTALL: { tab: string; code: CodeLine[] }[] = [
  {
    tab: "Server",
    code: [
      { t: "c", s: "# Install the Veritas Server (.deb)" }, { t: "cmd", s: "sudo apt install ./veritas_1.0.16_amd64.deb" }, { t: "gap" },
      { t: "c", s: "# Get your machine fingerprint" }, { t: "cmd", s: "sudo veritas fingerprint" }, { t: "gap" },
      { t: "out", s: "v2:a3f8c2d1e9b47f6c..." }, { t: "c", s: "# Send this hash to your Veritas contact" },
    ],
  },
  {
    tab: "License",
    code: [
      { t: "c", s: "# Install your signed license file" }, { t: "cmd", s: "sudo veritas license ./veritas.vlic" }, { t: "gap" },
      { t: "ok", s: "✓ License valid" }, { t: "ok", s: "✓ Machine fingerprint matched" }, { t: "ok", s: "✓ Veritas service started" }, { t: "gap" },
      { t: "url", s: "  → Dashboard: http://localhost:8000" },
    ],
  },
  {
    tab: "Agent",
    code: [
      { t: "c", s: "# agent-config.yaml" }, { t: "prop", k: "veritas_address", v: "'https://veritas.your-company.internal'" },
      { t: "prop", k: "registration_key", v: "'KEY-FROM-DASHBOARD'" }, { t: "plain", s: "sources:" }, { t: "plain", s: "  - type: file" },
      { t: "prop", k: "    path", v: "'/var/log/your-app/*.log'" }, { t: "plain", s: "  - type: docker" }, { t: "prop", k: "    container", v: "'order-service'" },
    ],
  },
  {
    tab: "Policy",
    code: [
      { t: "prop", k: "org_id", v: "'acme_retail'" }, { t: "plain", s: "fields:" }, { t: "plain", s: "  - field_name: aadhaar" },
      { t: "prop", k: "    declared_purpose", v: "'onboarding_kyc'" }, { t: "prop", k: "    retention_days", v: "180" },
      { t: "prop", k: "    source_system", v: "'partner-service'" }, { t: "gap" }, { t: "ok", s: "✓ Policy active — violations now detected" },
    ],
  },
]

// ─── Hero diagram: log packets flow from services into Veritas ───────────────
const C = 280
// Round so server and browser trig output render identical attributes
const r2 = (n: number) => Math.round(n * 100) / 100
const CYCLE = 4.8
const SERVICES = [
  { name: "Ingest", pii: true },
  { name: "Detect", pii: false },
  { name: "Evaluate", pii: true },
  { name: "Prevent", pii: true },
  { name: "Alert", pii: false },
  { name: "Prove", pii: true },
]

function NetworkDiagram() {
  const R = 200
  const nodes = SERVICES.map((s, i) => {
    const a = (-60 + i * 60) * (Math.PI / 180)
    return { ...s, x: r2(C + R * Math.cos(a)), y: r2(C + R * Math.sin(a)), a, delay: r2(i * (CYCLE / SERVICES.length)) }
  })

  return (
    <div className="tg-diagram" aria-label="Diagram: log lines from six services flow into Veritas, which flags and locks the ones carrying personal data">
      <svg viewBox="0 0 560 560" role="img">
        <circle className="ring dash" cx={C} cy={C} r={258} />
        <circle className="ring" cx={C} cy={C} r={R} />
        <circle className="ring dash rev" cx={C} cy={C} r={140} />
        <circle className="ring teal" cx={C} cy={C} r={84} />
        <circle className="pulse" cx={C} cy={C} r={R} />
        <circle className="pulse p2" cx={C} cy={C} r={R} />

        {nodes.map(n => <line key={`s-${n.name}`} className="spoke" x1={n.x} y1={n.y} x2={C} y2={C} />)}

        {/* Packets travel from each service to the hub */}
        <g transform={`translate(${C} ${C})`}>
          {nodes.map(n => (
            <g
              key={`p-${n.name}`}
              className={`packet ${n.pii ? "pii" : ""}`}
              style={{ "--x": `${r2(n.x - C)}px`, "--y": `${r2(n.y - C)}px`, "--cycle": `${CYCLE}s`, "--delay": `${n.delay}s` } as React.CSSProperties}
            >
              {n.pii && <circle className="halo" r={9} />}
              <circle r={4} />
            </g>
          ))}
        </g>

        {/* Service nodes */}
        {nodes.map(n => {
          const lx = r2(C + (R + 46) * Math.cos(n.a))
          const ly = r2(C + (R + 46) * Math.sin(n.a))
          const vars = { "--cycle": `${CYCLE}s`, "--delay": `${n.delay}s` } as React.CSSProperties
          return (
            <g key={`n-${n.name}`}>
              <circle className="node-bg" cx={n.x} cy={n.y} r={24} />
              <g className="node-ic">
                <rect x={n.x - 9} y={n.y - 8} width={18} height={6} rx={1.5} />
                <rect x={n.x - 9} y={n.y + 2} width={18} height={6} rx={1.5} />
              </g>
              {n.pii && <circle className="node-ring" cx={n.x} cy={n.y} r={24} style={vars} />}
              {n.pii && (
                <g className="lock" style={vars}>
                  <circle cx={n.x + 18} cy={n.y - 18} r={10} />
                  <path d={`M${n.x + 14} ${n.y - 18.5}h8v5.5h-8z M${n.x + 15.6} ${n.y - 18.5}v-2.2a2.4 2.4 0 0 1 4.8 0v2.2`} />
                </g>
              )}
              <text className="node-label" x={lx} y={ly + 4} textAnchor={Math.abs(Math.cos(n.a)) < 0.2 ? "middle" : Math.cos(n.a) > 0 ? "start" : "end"}>{n.name}</text>
            </g>
          )
        })}

        {/* Veritas hub */}
        <polygon className="hub-bg" points={[0, 1, 2, 3, 4, 5].map(i => { const a = (i * 60 - 90) * Math.PI / 180; return `${r2(C + 52 * Math.cos(a))},${r2(C + 52 * Math.sin(a))}` }).join(" ")} />
        <g className="hub-ic" transform={`translate(${C - 16} ${C - 16}) scale(1.333)`}>
          <path d="M12 2.5 20 6v6c0 4.6-3.3 8.4-8 9.5C7.3 20.4 4 16.6 4 12V6l8-3.5Z" />
          <path d="m8.5 12 2.4 2.4 4.6-4.8" />
        </g>
        <g className="hub-check">
          <circle cx={C + 36} cy={C - 32} r={11} />
          <path d={`M${C + 31} ${C - 32}l3.4 3.4 6-6.4`} />
        </g>
      </svg>
    </div>
  )
}

// ─── Product showcase mockups ────────────────────────────────────────────────
function DetectionMock() {
  const [masked, setMasked] = useState(false)
  useEffect(() => {
    const t = setInterval(() => setMasked(m => !m), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tg-ui">
      <div className="tg-ui-head"><b>payments-api · app.log</b><span style={{ display: "flex", alignItems: "center", gap: 8 }}><i className="live" />Scanning <span style={{ fontSize: "0.75em", opacity: 0.55, fontWeight: 400 }}>· Sample data</span></span></div>
      <div className="tg-ui-body">
        <div className="tg-log">
          <div><span className="k">level=</span>info <span className="k">route=</span>/v1/kyc/submit</div>
          <div><span className="k">name=</span><span className={`hit ${masked ? "masked" : ""}`}>{masked ? '"P•••• S•••••"' : '"Priya Sharma"'}</span><span className="tag">NAME</span></div>
          <div><span className="k">aadhaar=</span><span className={`hit ${masked ? "masked" : ""}`}>{masked ? '"XXXX XXXX 1956"' : '"4821 7730 1956"'}</span><span className="tag">AADHAAR</span></div>
          <div><span className="k">phone=</span><span className={`hit ${masked ? "masked" : ""}`}>{masked ? '"+91 •••• •4517"' : '"+91 98201 44517"'}</span><span className="tag">PHONE</span></div>
          <div><span className="k">loan_amt=</span>250000</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Aadhaar", "PAN Card", "Phone Numbers", "Names", "Email", "Address"].map(t => <span key={t} className="tg-chip">{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function RulesMock() {
  return (
    <div className="tg-ui">
      <div className="tg-ui-head"><b>DPDPA rule engine</b><span>4 rules active</span></div>
      <div className="tg-ui-body">
        {RULES.map(r => (
          <div key={r.title} className="tg-item">
            <span className="av"><ShieldCheck /></span>
            <div style={{ minWidth: 0 }}><p>{r.title}</p><small>{r.label}</small></div>
            <span className={`tg-chip ${r.severity === "HIGH" ? "high" : ""}`}>{r.severity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CasesMock() {
  const [on, setOn] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setOn(i => (i + 1) % CASES.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tg-ui">
      <div className="tg-ui-head"><b>Investigation dashboard</b><span><i className="live" />Live</span></div>
      <div className="tg-ui-body">
        <div className="tg-input"><Search /><span>Search cases, services, fields</span></div>
        {CASES.map((c, i) => {
          const Icon = c.icon
          return (
            <div key={c.title} className={`tg-item ${i === on ? "on" : ""}`}>
              <span className="av"><Icon /></span>
              <div style={{ minWidth: 0 }}><p>{c.title}</p><small>{c.meta}</small></div>
              <ChevronRight size={16} color="var(--color-smoke)" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChainMock() {
  const blocks = [
    { n: "#00412", h: "9f2c41…e8a71e" },
    { n: "#00411", h: "4bca07…31c441" },
    { n: "#00410", h: "af3e92…0d2b3b" },
  ]
  return (
    <div className="tg-ui">
      <div className="tg-ui-head"><b>Evidence chain</b><span style={{ color: "var(--color-circuit-teal)" }}><Check size={14} />chain_valid: true</span></div>
      <div className="tg-ui-body">
        <div className="tg-chain">
          {blocks.map((b, i) => (
            <React.Fragment key={b.n}>
              {i > 0 && <div className="tg-link-line" />}
              <div className="tg-block"><Link2 size={14} color="var(--color-circuit-teal)" /><span><b>{b.n}</b> verdict_hash</span><span>{b.h}</span></div>
            </React.Fragment>
          ))}
        </div>
        <div className="tg-input" style={{ justifyContent: "space-between" }}><span>Signed PDF audit report</span><span className="tg-chip">Export</span></div>
      </div>
    </div>
  )
}

// ─── Install tabs ────────────────────────────────────────────────────────────
function InstallCode() {
  const [tab, setTab] = useState(0)
  const s = INSTALL[tab]
  return (
    <div className="tg-code">
      <div className="tg-tabs" role="tablist" aria-label="Installation steps">
        {INSTALL.map((it, i) => (
          <button key={it.tab} role="tab" aria-selected={i === tab} className="tg-tab" onClick={() => setTab(i)}>{i + 1}. {it.tab}</button>
        ))}
      </div>
      <pre key={tab} className="tg-swap" role="tabpanel">
        {s.code.map((l, i) => {
          if (l.t === "gap") return <div key={i} style={{ height: 12 }} />
          if (l.t === "prop") return <div key={i}><span className="key">{l.k}:</span> <span className="val">{l.v}</span></div>
          return <div key={i} className={l.t === "plain" ? "val" : l.t}>{l.s}</div>
        })}
      </pre>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VeritasPage() {
  return (
    <SiteShell>

      {/* ── Hero ── */}
      <section className="tg-hero">
        <div className="tg-container tg-hero-grid">
          <div className="tg-hero-copy">
            <h1 className="tg-display">
              Stop guessing.<br />
              Start proving<br />
              <span className="tg-wire">DPDPA compliance.</span>
            </h1>
            <p className="tg-body">
              Veritas detects personal data in your application logs, maps violations to DPDPA obligations, and records <span className="tg-violet">tamper-evident evidence</span> — entirely on your own servers. No raw personal data leaves your network.
            </p>
            <div className="tg-hero-actions">
              <Link href="/book-demo" className="tg-btn tg-btn-primary">Book a Demo <ArrowRight /></Link>
              <Link href="/documentation#sample-report" className="tg-btn tg-btn-text">See a Sample Audit Report <ArrowRight /></Link>
            </div>
            <div className="tg-hero-meta">
              <span><i />v1.0.16 · Production-ready</span>
              <span><i />On-premise, your infra</span>
              <span><i />DPDPA 2023, India</span>
            </div>
          </div>
          <NetworkDiagram />
        </div>
      </section>

      {/* ── Entity strip ── */}
      <section className="tg-strip" aria-label="Personal data Veritas detects">
        <div className="tg-container">
          <span className="tg-caption">Detects India-specific personal data entity types, including</span>
          <div className="tg-strip-row">
            {["Aadhaar", "PAN Card", "Voter ID", "Passport", "Driving Licence", "UPI VPA", "IFSC", "GSTIN", "Phone", "Email", "Names", "Address", "Bank A/C", "DOB"].map(e => <span key={e}>{e}</span>)}
          </div>
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">The problem</span>
            <h2 className="tg-h2">DPDPA 2023 requires you to detect violations before they become breaches.</h2>
            <p className="tg-body">Every organisation subject to DPDPA must track where personal data goes, why it&apos;s being used, how long it&apos;s retained, and prove compliance to auditors. Doing this manually across hundreds of services is impossible.</p>
          </Reveal>
          <div className="tg-cols-3">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal key={p.title} className="tg-feature" delay={i * 80}>
                  <span className="ic"><Icon /></span>
                  <h3 className="tg-title">{p.title}</h3>
                  <p className="tg-body"><span className="tg-violet">{p.lead}</span>{p.rest}</p>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Capabilities</span>
            <h2 className="tg-h2">Everything you need for DPDPA compliance.</h2>
          </Reveal>
          <div className="tg-rows">
            <Reveal className="tg-row">
              <div className="tg-row-copy">
                <span className="tg-eyebrow">PII detection engine</span>
                <h3 className="tg-h3">Detects personal data in your application logs</h3>
                <p className="tg-body">Automatically scans logs and API traffic for personal data across India-specific entity types. Uses validated patterns — Aadhaar Verhoeff checksum, PAN structural rules — to minimise false positives. <span className="tg-violet">Runs fully on your server — no external API calls.</span></p>
                <ul>
                  <li><ScanSearch /><div><b>Logs and API traffic</b><span>File, Docker and Kubernetes log sources</span></div></li>
                  <li><ShieldCheck /><div><b>No raw personal data leaves your network</b><span>Optional AI investigation sends only field names and rule text — never raw values</span></div></li>
                </ul>
                <Link href="/product" className="tg-link">Learn more <ChevronRight /></Link>
              </div>
              <div className="tg-showcase"><DetectionMock /></div>
            </Reveal>

            <Reveal className="tg-row flip">
              <div className="tg-row-copy">
                <span className="tg-eyebrow">DPDPA rule engine</span>
                <h3 className="tg-h3">Validated detections mapped to DPDPA obligations.</h3>
                <p className="tg-body">Define your data policy once in YAML, with each field&apos;s declared purpose, retention window and source system. <span className="tg-violet">No code change needed.</span></p>
                <ul>
                  <li><Target /><div><b>Purpose limitation</b><span>Flags data used in a system its consent scope doesn&apos;t permit</span></div></li>
                  <li><Fingerprint /><div><b>Re-identification risk</b><span>Catches harmless fields that together identify a person</span></div></li>
                </ul>
                <Link href="/how-it-works" className="tg-link">Learn more <ChevronRight /></Link>
              </div>
              <div className="tg-showcase violet"><RulesMock /></div>
            </Reveal>

            <Reveal className="tg-row">
              <div className="tg-row-copy">
                <span className="tg-eyebrow">Investigation dashboard</span>
                <h3 className="tg-h3">Live violations. Full case lifecycle.</h3>
                <p className="tg-body">Violations appear live via WebSocket. Open cases, investigate with optional AI explanations (no raw PII sent), annotate, and move <span className="tg-violet">OPEN → ACKNOWLEDGED → RESOLVED.</span></p>
                <ul>
                  <li><Sparkles /><div><b>Optional AI explanations</b><span>OpenAI, Anthropic or a local Ollama model. Only field names and rule text are sent</span></div></li>
                  <li><LayoutDashboard /><div><b>Live Stream, Audit Ledger, Agent Management, PDF Export</b><span>One dashboard for the whole compliance team</span></div></li>
                </ul>
                <Link href="/product" className="tg-link">Learn more <ChevronRight /></Link>
              </div>
              <div className="tg-showcase"><CasesMock /></div>
            </Reveal>

            <Reveal className="tg-row flip">
              <div className="tg-row-copy">
                <span className="tg-eyebrow">Tamper-evident evidence</span>
                <h3 className="tg-h3">SHA-256 hash chain</h3>
                <p className="tg-body">Every verdict links to the previous via SHA-256 hash. Verify the chain at any time. <span className="tg-violet">Export a signed PDF audit report for regulators.</span></p>
                <Link href="/security" className="tg-link">Learn more <ChevronRight /></Link>
              </div>
              <div className="tg-showcase violet"><ChainMock /></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Features: What it does ── */}
      <section className="tg-section" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} aria-labelledby="features-title">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Features</span>
            <h2 className="tg-h2" id="features-title">What your systems actually do with personal data.</h2>
            <p className="tg-body" style={{ maxWidth: 560 }}>
              Veritas watches logs, APIs and database changes inside your own infrastructure, and keeps evidence an auditor can check without trusting us.
            </p>
          </Reveal>

          {/* 6-card grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"64px 40px" }} className="vw-cards">
            <style>{`
              @media(max-width:960px){.vw-cards{grid-template-columns:repeat(2,1fr)!important}}
              @media(max-width:620px){.vw-cards{grid-template-columns:1fr!important}}
              .vw-win{background:#141414;border:2px solid #F3F1ED;border-radius:8px;box-shadow:6px 6px 0 #DCFF00;height:214px;overflow:hidden;text-align:left;transition:box-shadow 0.25s,border-color 0.25s;}
              .vw-win:hover{box-shadow:0 0 0 2px #eef35f,0 0 32px rgba(238,243,95,0.35),6px 6px 0 #eef35f!important;border-color:#eef35f!important;}
              .vw-bar{display:flex;gap:5px;padding:7px 10px;border-bottom:2px solid #F3F1ED;background:#1d1d1d}
              .vw-bar i{width:7px;height:7px;border-radius:50%}
              .vw-ttl{font-weight:700;font-size:12px;padding:9px 12px 0;color:#fff}
              .vw-body{padding:8px 12px 12px;font-size:11px}
              .vw-chip{position:absolute;border:2px solid #0A0A0A;border-radius:10px;padding:7px 11px;font-weight:700;font-size:11px;line-height:1.25;box-shadow:3px 3px 0 #F3F1ED;white-space:nowrap}
              .vw-chip b{display:block;font-weight:800;font-size:17px;line-height:1.1}
              .vw-tag{display:inline-block;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;border:1.5px solid #5a5a5a;background:#1d1d1d;color:#F3F1ED}
              .vw-tag.o{background:#FF5722;color:#fff;border-color:#FF5722}
              .vw-tag.v{background:#7B6CE0;color:#fff;border-color:#7B6CE0}
              .vw-tag.l{background:#DCFF00;color:#0A0A0A;border-color:#DCFF00}
              .vw-tile{border:1.5px solid #3a3a3a;border-radius:6px;padding:7px 9px;background:#1d1d1d}
              .vw-tile small{display:block;font-size:9.5px;color:#a1a1a1;font-weight:500}
              .vw-tile strong{font-weight:800;font-size:20px;line-height:1.1;color:#fff}
              .vw-row{display:flex;align-items:center;gap:6px;border:1.5px solid #3a3a3a;border-radius:6px;padding:6px 8px;background:#1d1d1d;font-weight:600;font-size:11px;color:#F3F1ED}
              .vw-code{font:500 10.5px/1.5 ui-monospace,Menlo,Consolas,monospace;border:1.5px solid #3a3a3a;border-radius:6px;padding:6px 8px;background:#1d1d1d;margin-bottom:6px;word-break:break-all;color:#F3F1ED}
              .vw-steps{display:flex;gap:4px;margin:6px 0 11px}
              .vw-steps span{flex:1;text-align:center;font-size:9.5px;font-weight:700;padding:4px 0;border:1.5px solid #3a3a3a;border-radius:5px;background:#1d1d1d;color:#F3F1ED}
              .vw-steps span.on{background:#7B6CE0;color:#fff;border-color:#7B6CE0}
              .vw-steps span.now{background:#DCFF00;color:#0A0A0A;border-color:#DCFF00}
            `}</style>

            {/* 1 — Audit Ledger */}
            <Reveal delay={0}>
              <article style={{ textAlign:"center" }}>
                <div style={{ position:"relative", padding:"0 18px 22px 0", margin:"0 auto 26px", maxWidth:340 }}>
                  <div className="vw-win" role="img" aria-label="Audit ledger">
                    <div className="vw-bar"><i style={{background:"#FF5722"}} /><i style={{background:"#DCFF00"}} /><i style={{background:"#7B6CE0"}} /></div>
                    <div className="vw-ttl">Audit Ledger</div>
                    <div className="vw-body">
                      <div style={{ display:"flex", alignItems:"baseline", gap:8, font:"800 30px/1 Inter,sans-serif", margin:"4px 0 9px", color:"#fff", letterSpacing:"-.03em" }}>
                        12,000 <span style={{ font:"500 11px Inter,sans-serif", color:"#a1a1a1" }}>findings</span> → <em style={{ fontStyle:"normal", color:"#DCFF00" }}>9</em> <span style={{ font:"500 11px Inter,sans-serif", color:"#a1a1a1" }}>incidents</span>
                      </div>
                      <div className="vw-row"><span>INC-4</span><span className="vw-tag o">EXPOSURE</span><span>noisy-service</span></div>
                      <svg viewBox="0 0 240 34" preserveAspectRatio="none" aria-hidden="true" style={{ display:"block", width:"100%", height:34, marginTop:8 }}><polyline fill="none" stroke="#DCFF00" strokeWidth="2.5" strokeLinejoin="round" points="0,26 20,22 40,24 60,14 80,18 100,8 120,16 140,12 160,20 180,6 200,14 220,10 240,18"/></svg>
                    </div>
                  </div>
                  <span className="vw-chip" style={{ background:"#FF5722", color:"#fff", right:-4, top:58 }}>Reopened: recurred</span>
                </div>
                <h3 style={{ fontWeight:600, fontSize:19, lineHeight:1.25, letterSpacing:"-.015em", marginBottom:8 }}>Findings that become a short list</h3>
                <p style={{ fontSize:14, lineHeight:1.55, color:"#a1a1a1", maxWidth:290, margin:"0 auto" }}>12,000 alerts turn into a few incidents, each with an owner.</p>
              </article>
            </Reveal>

            {/* 2 — Data map */}
            <Reveal delay={60}>
              <article style={{ textAlign:"center" }}>
                <div style={{ position:"relative", padding:"0 18px 22px 0", margin:"0 auto 26px", maxWidth:340 }}>
                  <div className="vw-win" role="img" aria-label="Data map">
                    <div className="vw-bar"><i style={{background:"#FF5722"}} /><i style={{background:"#DCFF00"}} /><i style={{background:"#7B6CE0"}} /></div>
                    <div className="vw-ttl">Data map</div>
                    <div className="vw-body">
                      <svg viewBox="0 0 280 150" aria-hidden="true" style={{ display:"block", width:"100%", height:150 }}>
                        <g stroke="#8a8a8a" strokeWidth="2"><line x1="140" y1="72" x2="52" y2="32"/><line x1="140" y1="72" x2="228" y2="32"/><line x1="140" y1="72" x2="52" y2="116"/><line x1="140" y1="72" x2="228" y2="116"/></g>
                        <circle cx="140" cy="72" r="15" fill="#141414" stroke="#F3F1ED" strokeWidth="2"/><text x="140" y="75" textAnchor="middle" style={{fontSize:"7.5px", fill:"#F3F1ED", fontWeight:600}}>logs</text>
                        <circle cx="52" cy="32" r="12" fill="#DCFF00" stroke="#F3F1ED" strokeWidth="2"/><text x="52" y="58" textAnchor="middle" style={{fontSize:"8.5px", fill:"#F3F1ED", fontWeight:600}}>order-svc</text>
                        <circle cx="228" cy="32" r="12" fill="#7B6CE0" stroke="#F3F1ED" strokeWidth="2"/><text x="228" y="58" textAnchor="middle" style={{fontSize:"8.5px", fill:"#F3F1ED", fontWeight:600}}>support</text>
                        <circle cx="52" cy="116" r="12" fill="#FF5722" stroke="#F3F1ED" strokeWidth="2"/><text x="52" y="142" textAnchor="middle" style={{fontSize:"8.5px", fill:"#F3F1ED", fontWeight:600}}>kyc-service</text>
                        <circle cx="228" cy="116" r="12" fill="#2a2a2a" stroke="#F3F1ED" strokeWidth="2"/><text x="228" y="142" textAnchor="middle" style={{fontSize:"8.5px", fill:"#F3F1ED", fontWeight:600}}>analytics</text>
                      </svg>
                    </div>
                  </div>
                  <span className="vw-chip" style={{ background:"#DCFF00", color:"#0A0A0A", right:-4, bottom:48 }}>Phone, Aadhaar, Email seen</span>
                </div>
                <h3 style={{ fontWeight:600, fontSize:19, lineHeight:1.25, letterSpacing:"-.015em", marginBottom:8 }}>See where personal data really flows</h3>
                <p style={{ fontSize:14, lineHeight:1.55, color:"#a1a1a1", maxWidth:290, margin:"0 auto" }}>An observed map of your systems, not a diagram someone drew.</p>
              </article>
            </Reveal>

            {/* 3 — Evidence chain */}
            <Reveal delay={120}>
              <article style={{ textAlign:"center" }}>
                <div style={{ position:"relative", padding:"0 18px 22px 0", margin:"0 auto 26px", maxWidth:340 }}>
                  <div className="vw-win" role="img" aria-label="Evidence chain">
                    <div className="vw-bar"><i style={{background:"#FF5722"}} /><i style={{background:"#DCFF00"}} /><i style={{background:"#7B6CE0"}} /></div>
                    <div className="vw-ttl">Evidence chain</div>
                    <div className="vw-body">
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:4 }}>
                        <div className="vw-tile"><small>Records</small><strong>3,643</strong></div>
                        <div className="vw-tile"><small>Checkpoints</small><strong>2/2</strong><small>witnessed</small></div>
                      </div>
                      <div style={{ display:"flex", gap:3, marginTop:12 }}>
                        {["#1","#2","#3","#4","#5"].map(n => <span key={n} className="vw-tag l">{n}</span>)}
                        <span className="vw-tag">…</span>
                      </div>
                    </div>
                  </div>
                  <span className="vw-chip" style={{ background:"#DCFF00", color:"#0A0A0A", right:-4, top:54 }}>Independent verifier<b>PASS</b></span>
                  <span className="vw-chip" style={{ background:"#FF5722", color:"#fff", left:-8, bottom:6 }}>Edited copy<b>FAIL</b></span>
                </div>
                <h3 style={{ fontWeight:600, fontSize:19, lineHeight:1.25, letterSpacing:"-.015em", marginBottom:8 }}>Evidence you can verify yourself</h3>
                <p style={{ fontSize:14, lineHeight:1.55, color:"#a1a1a1", maxWidth:290, margin:"0 auto" }}>Tamper-evident records an auditor checks offline.</p>
              </article>
            </Reveal>

            {/* 4 — Agent redaction */}
            <Reveal delay={0}>
              <article style={{ textAlign:"center" }}>
                <div style={{ position:"relative", padding:"0 18px 22px 0", margin:"0 auto 26px", maxWidth:340 }}>
                  <div className="vw-win" role="img" aria-label="Agent redaction">
                    <div className="vw-bar"><i style={{background:"#FF5722"}} /><i style={{background:"#DCFF00"}} /><i style={{background:"#7B6CE0"}} /></div>
                    <div className="vw-ttl">Agent redaction</div>
                    <div className="vw-body">
                      <div className="vw-code">callback <span style={{ color:"#FF5722", fontWeight:700 }}>9876543210</span></div>
                      <div className="vw-code">callback <span style={{ background:"#DCFF00", color:"#0A0A0A", padding:"0 3px", borderRadius:3, fontWeight:700 }}>[PHONE_REDACTED]</span></div>
                      <div style={{ display:"flex", gap:5, marginTop:9, flexWrap:"wrap" }}>
                        {["monitor","mask","hash","drop"].map((t,i) => <span key={t} className={`vw-tag${i===1?" v":""}`}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <span className="vw-chip" style={{ background:"#F3F1ED", color:"#0A0A0A", right:-4, bottom:44 }}>Raw values sent<b>0</b></span>
                </div>
                <h3 style={{ fontWeight:600, fontSize:19, lineHeight:1.25, letterSpacing:"-.015em", marginBottom:8 }}>Prevention at the source</h3>
                <p style={{ fontSize:14, lineHeight:1.55, color:"#a1a1a1", maxWidth:290, margin:"0 auto" }}>Personal data is masked on the host before it travels.</p>
              </article>
            </Reveal>

            {/* 5 — Rights requests */}
            <Reveal delay={60}>
              <article style={{ textAlign:"center" }}>
                <div style={{ position:"relative", padding:"0 18px 22px 0", margin:"0 auto 26px", maxWidth:340 }}>
                  <div className="vw-win" role="img" aria-label="Rights requests">
                    <div className="vw-bar"><i style={{background:"#FF5722"}} /><i style={{background:"#DCFF00"}} /><i style={{background:"#7B6CE0"}} /></div>
                    <div className="vw-ttl">Rights requests</div>
                    <div className="vw-body">
                      <div className="vw-steps">
                        <span className="on">Lookup</span><span className="on">Tasks</span><span className="now">Confirmed</span><span>Closed</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12, fontWeight:600, lineHeight:1.4 }}>
                        <div style={{ width:64, height:64, borderRadius:"50%", background:"conic-gradient(#7B6CE0 0 100%)", display:"grid", placeItems:"center", flexShrink:0 }}>
                          <div style={{ width:42, height:42, borderRadius:"50%", background:"#141414", display:"grid", placeItems:"center", fontWeight:800, fontSize:13, color:"#fff" }}>2/2</div>
                        </div>
                        <div style={{ fontSize:12, color:"#F3F1ED" }}>2 of 2 owners<br/>confirmed</div>
                      </div>
                    </div>
                  </div>
                  <span className="vw-chip" style={{ background:"#7B6CE0", color:"#fff", right:-4, bottom:34 }}>Signed record (PDF)</span>
                </div>
                <h3 style={{ fontWeight:600, fontSize:19, lineHeight:1.25, letterSpacing:"-.015em", marginBottom:8 }}>Rights requests with proof</h3>
                <p style={{ fontSize:14, lineHeight:1.55, color:"#a1a1a1", maxWidth:290, margin:"0 auto" }}>Find an identifier, task each owner, keep a signed record.</p>
              </article>
            </Reveal>

            {/* 6 — Breach report */}
            <Reveal delay={120}>
              <article style={{ textAlign:"center" }}>
                <div style={{ position:"relative", padding:"0 18px 22px 0", margin:"0 auto 26px", maxWidth:340 }}>
                  <div className="vw-win" role="img" aria-label="Draft breach report">
                    <div className="vw-bar"><i style={{background:"#FF5722"}} /><i style={{background:"#DCFF00"}} /><i style={{background:"#7B6CE0"}} /></div>
                    <div className="vw-ttl">Draft breach report</div>
                    <div className="vw-body">
                      <div style={{ display:"grid", gap:5, marginTop:6 }}>
                        {[["First seen","from chain"],["Acknowledged","12 min"],["Resolved","2 h"]].map(([k,v]) => (
                          <div key={k} className="vw-row" style={{ justifyContent:"space-between" }}>
                            <span>{k}</span><span style={{ color:"#DCFF00", fontWeight:700 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:7, background:"#DCFF00", color:"#0A0A0A", borderRadius:6, padding:"5px 8px", fontWeight:700, fontSize:10 }}>Draft for the DPO and counsel</div>
                    </div>
                  </div>
                  <span className="vw-chip" style={{ background:"#FF5722", color:"#fff", right:-4, top:50 }}>Number affected:<br/>to be completed</span>
                </div>
                <h3 style={{ fontWeight:600, fontSize:19, lineHeight:1.25, letterSpacing:"-.015em", marginBottom:8 }}>Breach-ready reports</h3>
                <p style={{ fontSize:14, lineHeight:1.55, color:"#a1a1a1", maxWidth:290, margin:"0 auto" }}>A draft report built from the signed chain, for your DPO.</p>
              </article>
            </Reveal>
          </div>

          <p style={{ marginTop:56, maxWidth:600, fontSize:13, lineHeight:1.6, color:"#a1a1a1" }}>
            Sample data shown. Veritas monitors your technical systems; it doesn&rsquo;t replace consent management or legal review.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="tg-section">
        <div className="tg-container">
          <div className="tg-stats">
            {[
              { n: "100%", t: "on-premise — server, evidence store and dashboard run entirely on your infrastructure. No cloud dependency." },
              { n: "4", t: "server-enforced RBAC roles with TLS by default. Machine-bound licence verified offline." },
            ].map((s, i) => (
              <Reveal key={i} className="tg-stat" delay={i * 80}>
                <strong>{s.n}</strong>
                <p className="tg-body">{s.t}</p>
              </Reveal>
            ))}
          </div>
          {/* ── Scope disclaimer ── */}
          <Reveal className="tg-head" style={{ marginTop: 40 }}>
            <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <p className="tg-body-sm" style={{ textAlign: "center", opacity: 0.7 }}>
                <strong style={{ opacity: 1 }}>Scope:</strong> Veritas covers personal data found in application logs and API traffic. It does not replace consent management, rights-request handling, or legal advice. This tool supports your compliance programme — it is not a certification.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Compliance as code ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Installation</span>
            <h2 className="tg-h2">Compliance as code, from install to first violation.</h2>
          </Reveal>
          <Reveal className="tg-code-wrap">
            <InstallCode />
            <div className="tg-side">
              <h3 className="tg-title">Four steps on your own servers</h3>
              <p className="tg-body">Install the server on Ubuntu 22.04+, activate your machine-bound license, deploy one agent per application server, and upload your org config. <span className="tg-violet">Policy changes need no code change.</span></p>
              <Link href="/documentation/quickstart" className="tg-btn tg-btn-outline" style={{ justifySelf: "start" }}>Open the quickstart <ArrowRight /></Link>
              <Link href="/documentation" className="tg-link violet">Explore the documentation <ChevronRight /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="tg-section">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Who it&apos;s for</span>
            <h2 className="tg-h2">Built for every team responsible for data compliance.</h2>
          </Reveal>
          <div className="tg-cards">
            {AUDIENCES.map((a, i) => {
              const Icon = a.icon
              return (
                <Reveal key={a.label} className="tg-card" delay={(i % 2) * 80}>
                  <div className="who"><span className="av"><Icon /></span><div><b>{a.title}</b><span>{a.label}</span></div></div>
                  <p className="tg-body">{a.desc}</p>
                  <div className="chips">{a.badges.map(b => <span key={b} className="tg-chip">{b}</span>)}</div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Regulatory urgency ── */}
      <section className="tg-section" style={{ paddingTop: 0 }}>
        <div className="tg-container">
          <Reveal>
            <div style={{ padding: "20px 24px", borderRadius: 12, border: "1px solid rgba(238,243,95,0.15)", background: "rgba(238,243,95,0.04)", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <p className="tg-body-sm" style={{ margin: 0, opacity: 0.85 }}>
                <strong style={{ color: "#eef35f" }}>Penalty phase incoming.</strong> DPDP Rules 2025 have been notified. Verify exact dates and obligations with your legal counsel before acting.
              </p>
              <Link href="/book-demo" className="tg-btn tg-btn-primary" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Talk to us <ArrowRight /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Download / Trial ── */}
      <section className="tg-section" id="download">
        <div className="tg-container">
          <Reveal className="tg-head">
            <span className="tg-eyebrow">Start a Pilot</span>
            <h2 className="tg-h2">Deploys on your own infrastructure.</h2>
            <p className="tg-body">Veritas is a licensed software package that installs directly on your existing servers. Here&apos;s exactly what happens when you request access:</p>
            <ol style={{ margin: "16px 0 0", paddingLeft: 20, display: "grid", gap: 6 }}>
              {[
                "Create a free account (Google Workspace work email preferred — personal Gmail also works)",
                "Receive the installer guide for your OS by email",
                "Install on your server and get your machine fingerprint",
                "Share the fingerprint with us to receive your signed licence key",
                "Deploy agents to your application servers and see your first findings",
              ].map((step, i) => (
                <li key={i} className="tg-body-sm" style={{ opacity: 0.8 }}>{step}</li>
              ))}
            </ol>
          </Reveal>
          <DownloadButtons />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tg-cta">
        <div className="tg-container">
          <h2 className="tg-h2">Ready to find Aadhaar and PAN<br />in your logs?</h2>
          <p className="tg-body" style={{ maxWidth: 520 }}>Book a 20-minute demo and see Veritas detect a real DPDPA violation — from agent deployment to signed evidence export.</p>
          <div className="tg-hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/book-demo" className="tg-btn tg-btn-primary">Book a 20-Min Demo <ArrowRight /></Link>
            <Link href="/documentation#sample-report" className="tg-btn tg-btn-text">See a Sample Audit Report <ArrowRight /></Link>
            <Link href="/documentation" className="tg-btn tg-btn-text">Documentation <ArrowRight /></Link>
          </div>
        </div>
      </section>

    </SiteShell>
  )
}

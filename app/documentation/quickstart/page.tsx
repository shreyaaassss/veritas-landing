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
    <div ref={ref} className={`rounded-2xl border border-white/[0.09] bg-[#0e0f11] overflow-hidden hover:border-white/[0.19] ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06]">{children}</span>
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative rounded-xl bg-[#141617] border border-white/[0.08] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] text-white/30 tracking-widest uppercase">{language}</span>
        <button onClick={copy} className="text-[10px] text-white/30 hover:text-white/60 tracking-widest transition-colors">
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <pre className="p-4 text-[13px] text-white/75 font-mono leading-relaxed overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  )
}

function Step({ n, title, lead, children }: { n: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={`step-${Number(n)}`}>
      <BentoCard className="p-8 md:p-10" delay={0}>
        <div className="flex items-start gap-4 mb-6">
          <span className="font-pixel text-[11px] text-white/35 tracking-widest">{n}</span>
          <div>
            <h2 className="text-2xl font-light">{title}</h2>
            <p className="mt-2 text-sm text-white/60">{lead}</p>
          </div>
        </div>
        {children}
      </BentoCard>
    </section>
  )
}

function Expected({ lines }: { lines: string[] }) {
  return (
    <div className="mt-5 rounded-xl bg-[#141617] border border-white/[0.08] p-4">
      <div className="text-[10px] text-white/30 tracking-widest mb-3">Expected result</div>
      <div className="space-y-1.5 font-mono text-[12px]">
        {lines.map((l, i) => <div key={i} className={i === 0 ? "text-[#00cbaa]" : "text-white/55"}>{l}</div>)}
      </div>
    </div>
  )
}

export default function QuickstartPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <Tag>QUICKSTART</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl font-light tracking-tight leading-[1.02]">
            {"From a fresh server\nto verified evidence."}
          </RevealText>
          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-xl">
            Install Veritas on your own server, connect an agent, see your first finding, and check the evidence the way an auditor would.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/50">
            <span>You need: a server inside your network</span>
            <span>·</span>
            <span>A Veritas licence for that machine</span>
          </div>
        </div>
      </section>

      {/* Step nav */}
      <section className="sticky top-20 z-40 px-6 md:px-12 lg:px-20 py-3 border-y border-white/[0.08] bg-black/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-6 overflow-x-auto">
          {["Install", "License", "Connect an agent", "First finding", "Verify"].map((step, i) => (
            <a key={step} href={`#step-${i + 1}`} className="text-[11px] text-white/55 hover:text-white tracking-widest whitespace-nowrap transition-colors">
              {String(i + 1).padStart(2, "0")} {step}
            </a>
          ))}
        </div>
      </section>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-16 space-y-20">

        <Step n="01" title="Install the server" lead="On Ubuntu or Debian, use the install script or the package. macOS and Windows installers are covered in the documentation.">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">Install script</div>
              <CodeBlock code="curl -sSL https://raw.githubusercontent.com/shreyaaassss/Veritas/main/install.sh | sudo bash" />
            </div>
            <div>
              <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">Or the package</div>
              <CodeBlock code="sudo apt install ./veritas_<version>_amd64.deb" />
            </div>
          </div>
        </Step>

        <Step n="02" title="License and first-run setup" lead="Print the fingerprint, install the licence we send back, and create the first administrator.">
          <CodeBlock code={`sudo veritas fingerprint
# Send the output to your Veritas contact, then:
sudo veritas license /path/to/veritas.vlic
sudo veritas status

sudo veritas setup-code
# Visit https://your-server:8000/setup and enter the code`} />
          <div className="mt-5 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20">
            <p className="text-xs text-amber-300 leading-relaxed">
              <span className="font-medium">Tip:</span> turn on evidence anchoring with at least one witness before your first finding, so the audit pack has signed checkpoints to verify against. The System Health panel on the Overview shows its status.
            </p>
          </div>
        </Step>

        <Step n="03" title="Connect an agent" lead="Issue a registration key under Agents, Issue Registration Key, then install the agent on an application host.">
          <CodeBlock code={`sudo dpkg -i veritas-agent_<version>_all.deb
sudo veritas-agent fetch-cert https://your-server:8000
sudo nano /etc/veritas-agent/config.yaml

# config.yaml
veritas_address: https://your-server:8000
registration_key: KEY-FROM-DASHBOARD
source_label: app-host-01
sources:
  - type: file
    path: /var/log/app/application.log
    source_system: support-ticketing
redaction:
  categories: { aadhaar: mask, phone: hash, email: mask }

sudo veritas-agent start`} />
          <Expected lines={["Registered as VERITAS-AGENT-...", "The agent appears under Agents with its heartbeat and masking mode"]} />
        </Step>

        <Step n="04" title="Declare your policy and see a first finding" lead="Describe the system in Policy, Edit Policy, then write a test line that carries sample personal data.">
          <CodeBlock code={`# A test line with published sample values, never real data
echo "$(date '+%F %T') INFO ticket 1 callback to 9876543210 aadhaar 2345 6789 0124 done" \\
  | sudo tee -a /var/log/app/application.log`} />
          <Expected lines={[
            "Audit Ledger shows a new incident for support-ticketing",
            "The stored line reads [PHONE#...] and [AADHAAR_REDACTED]",
            "The incident names the rule, the field and the owning team",
          ]} />
        </Step>

        <Step n="05" title="Verify the evidence" lead="Check the chain in the dashboard, then download the audit pack and verify it with no server and no network.">
          <CodeBlock code={`# Audit Ledger, Verify Cryptographic Hash Chain
# Then Download audit pack, and on any machine:
unzip audit-pack.zip -d audit-pack
cd audit-pack
sh verify.sh`} />
          <Expected lines={[
            "PASS  organization acme_retail: 214 records, 2 checkpoints",
            "The evidence matches every checkpoint. Records after the last checkpoint (if any) are not covered.",
          ]} />
          <p className="mt-5 text-xs text-white/50 leading-relaxed">
            SUMMARY.md in the pack states what the evidence proves and what it does not. If the pack does not include the verifier for your platform, VERIFY.md explains where to get it.
          </p>
        </Step>

        {/* Next steps */}
        <div className="pt-8 border-t border-white/[0.08]">
          <h2 className="text-2xl font-light mb-6">Next steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "User Guide", desc: "Incidents, rules, evidence and rights requests in depth.", href: "/documentation/user-guide" },
              { label: "Installation reference", desc: "Every platform, agent option and CLI command.", href: "/documentation" },
              { label: "Troubleshooting", desc: "Common problems and how to fix them.", href: "/documentation/troubleshooting" },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="block p-5 rounded-xl border border-white/[0.09] bg-[#0e0f11] hover:border-white/[0.19] hover:bg-[#141617] transition-all">
                <div className="text-sm font-light mb-1.5">{link.label} →</div>
                <div className="text-xs text-white/55">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  )
}

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

function CodeBlock({ children, filename }: { children: string; filename?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl bg-[#141617] overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
          <span className="font-pixel text-[10px] text-white/30 tracking-widest">{filename}</span>
          <button onClick={copy} className="text-[10px] text-white/30 hover:text-white/60 tracking-widest transition-colors">{copied ? "COPIED" : "COPY"}</button>
        </div>
      )}
      <pre className="p-5 text-[12px] font-mono text-white/55 leading-relaxed overflow-x-auto whitespace-pre">{children.trim()}</pre>
    </div>
  )
}

export default function DocumentationPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>DOCUMENTATION</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl font-light tracking-tight leading-[1.02]">
            {"Install. License.\nStart watching."}
          </RevealText>
          <p className="mt-7 text-base text-white/60 leading-relaxed max-w-xl">
            Installation, agent deployment, your data policy and the command-line reference for Veritas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Requirements", href: "#requirements" },
              { label: "Linux Install", href: "#linux" },
              { label: "macOS Install", href: "#macos" },
              { label: "Windows Install", href: "#windows" },
              { label: "Agent Deploy", href: "#agent" },
              { label: "Data Policy", href: "#orgconfig" },
              { label: "CLI Reference", href: "#cli" },
            ].map(link => (
              <a key={link.label} href={link.href} className="px-4 py-2 text-xs rounded-full font-medium border border-white/[0.1] bg-[#0e0f11] text-white/65 hover:text-white hover:border-white/25 transition-colors tracking-[0.012em]">{link.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>REQUIREMENTS</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-8">What you need before installing</h2>
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">VERITAS SERVER</div>
                <p className="text-sm text-white/65 leading-relaxed mb-6">Detection, rules, the evidence store and the dashboard. Install it on one machine inside your network.</p>
                <div className="space-y-3">
                  {[
                    ["RAM", "2 GB minimum, 4 GB recommended"],
                    ["Disk", "2 GB free"],
                    ["OS", "Ubuntu 22.04 or later, macOS 12 or later on Apple silicon, Windows 10 or later"],
                    ["Network", "No outbound access required. Optional witnesses, such as a time-stamp authority, receive only signed checkpoints."],
                    ["License", "A machine-bound .vlic file issued by Veritas (see below)"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start gap-4">
                      <span className="text-[10px] font-pixel text-white/45 tracking-widest w-20 shrink-0 pt-0.5">{k}</span>
                      <span className="text-sm text-white/70 leading-relaxed">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-5">VERITAS AGENT</div>
                <p className="text-sm text-white/65 leading-relaxed mb-6">Reads logs on each host and masks personal data before sending. Deploy one per application host or Kubernetes node.</p>
                <div className="space-y-3">
                  {[
                    ["RAM", "128 MB"],
                    ["Disk", "50 MB"],
                    ["OS", "Ubuntu 18.04 or later and other Linux distributions, macOS 12 or later on Apple silicon, or Kubernetes"],
                    ["Network", "Access to your Veritas server only"],
                    ["Auth", "A one-time registration key from the Veritas dashboard"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start gap-4">
                      <span className="text-[10px] font-pixel text-white/45 tracking-widest w-20 shrink-0 pt-0.5">{k}</span>
                      <span className="text-sm text-white/70 leading-relaxed">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* License first */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>BEFORE YOU INSTALL</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">Get your licence ready</h2>
          <p className="text-sm text-white/65 leading-relaxed mb-6">
            Veritas needs a machine-bound licence file (<code className="bg-white/[0.07] px-1 rounded font-mono text-[11px]">.vlic</code>). You print your machine fingerprint after installing, then send it to us to receive your licence.
          </p>
          <BentoCard className="p-7" delay={0}>
            <div className="space-y-5">
              {[
                { n: "1", step: "Install Veritas (see the steps below)" },
                { n: "2", step: "Run: sudo veritas fingerprint, and copy the result" },
                { n: "3", step: "Send the fingerprint to your Veritas contact" },
                { n: "4", step: "Receive your signed veritas.vlic file" },
                { n: "5", step: "Run: sudo veritas license /path/to/veritas.vlic" },
                { n: "6", step: "The service starts and the dashboard is available" },
              ].map(item => (
                <div key={item.n} className="flex items-start gap-4">
                  <span className="font-pixel text-[10px] text-white/40 tracking-widest shrink-0 w-4">{item.n}</span>
                  <span className="text-sm text-white/70">{item.step}</span>
                </div>
              ))}
            </div>
          </BentoCard>
          <p className="mt-4 text-xs text-white/50">
            Don&apos;t have a licence yet? <Link href="/book-demo" className="underline text-white/65 hover:text-white">Book a demo</Link> and we&apos;ll issue one for your machine.
          </p>
        </div>
      </section>

      {/* Linux */}
      <section id="linux" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>LINUX</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">Ubuntu 22.04 or later, and Debian</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/65 mb-3">Install the .deb package:</p>
              <CodeBlock filename="terminal">{`sudo apt install ./veritas_<version>_amd64.deb`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Print your machine fingerprint:</p>
              <CodeBlock filename="terminal">{`sudo veritas fingerprint
# Output: v2:a3f8c2d1e9b47f6c8a...
# Send this to your Veritas contact to receive your .vlic file`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Install the licence and check the service:</p>
              <CodeBlock filename="terminal">{`sudo veritas license /path/to/veritas.vlic
sudo veritas status`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Complete first-run setup:</p>
              <CodeBlock filename="terminal">{`sudo veritas setup-code
# Visit https://your-server:8000/setup
# Enter the setup code to create the first administrator account`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* macOS */}
      <section id="macos" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>MACOS</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">macOS 12 or later on Apple silicon</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/65 mb-3">Install the package:</p>
              <CodeBlock filename="terminal">{`sudo installer -pkg veritas_<version>_arm64.pkg -target /`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Print the fingerprint and install the licence:</p>
              <CodeBlock filename="terminal">{`sudo veritas fingerprint
sudo veritas license /path/to/veritas.vlic`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">The service starts in the background. Complete setup:</p>
              <CodeBlock filename="terminal">{`sudo veritas setup-code
# Visit https://localhost:8000/setup`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Windows */}
      <section id="windows" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>WINDOWS</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">Windows 10 or later</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/65 mb-3">Run the installer:</p>
              <CodeBlock filename="cmd">{`veritas_<version>_windows_amd64.exe
# Follow the installation wizard`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Print the fingerprint and install the licence:</p>
              <CodeBlock filename="cmd">{`veritas fingerprint
veritas license C:\\path\\to\\veritas.vlic`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">The service runs as a Windows service. Complete setup:</p>
              <CodeBlock filename="cmd">{`veritas setup-code
# Visit https://localhost:8000/setup`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Agent */}
      <section id="agent" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>AGENT DEPLOYMENT</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-4">Deploy the Veritas agent</h2>
          <p className="text-sm text-white/65 mb-8 leading-relaxed">
            Install one agent on each application host you want to watch. First, issue a registration key from the Veritas dashboard under <strong className="font-medium text-white/72">Agents, Issue Registration Key</strong>. Each key works once.
          </p>

          <div className="space-y-8">
            <div>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">OPTION 1: LINUX PACKAGE</div>
              <CodeBlock filename="terminal">{`sudo dpkg -i veritas-agent_<version>_all.deb
sudo veritas-agent fetch-cert https://veritas.your-company.internal:8000

# Edit /etc/veritas-agent/config.yaml
veritas_address: https://veritas.your-company.internal:8000
registration_key: KEY-FROM-DASHBOARD
source_label: payments-host-01
sources:
  - type: file
    path: /var/log/app/application.log
    source_system: payments-service
redaction:
  categories: { aadhaar: mask, phone: hash, email: mask }

sudo veritas-agent start`}</CodeBlock>
            </div>

            <div>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">OPTION 2: MACOS PACKAGE</div>
              <CodeBlock filename="terminal">{`sudo installer -pkg veritas-agent_<version>_arm64.pkg -target /
sudo nano /etc/veritas-agent/config.yaml      # same settings as above
sudo veritas-agent grant-read /path/to/each/log/file
sudo veritas-agent start
sudo veritas-agent logs                       # expect "Registered as VERITAS-AGENT-..."`}</CodeBlock>
            </div>

            <div>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">OPTION 3: KUBERNETES</div>
              <CodeBlock filename="terminal">{`# Set your server address and registration key in the manifest, then:
kubectl apply -f veritas-agent-k8s_<version>.yaml

# One agent runs on each node. Check them:
kubectl get pods -l app.kubernetes.io/name=veritas-agent`}</CodeBlock>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-xl border border-amber-400/20 bg-amber-400/10">
            <p className="text-xs text-amber-300 leading-relaxed">
              Each agent appears in the dashboard under <strong>Agents</strong> with its heartbeat and masking mode. If an agent is compromised or retired, click <strong>Revoke</strong> to invalidate its token at once.
            </p>
          </div>
        </div>
      </section>

      {/* Data policy */}
      <section id="orgconfig" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>DATA POLICY</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-4">Declare your data policy</h2>
          <p className="text-sm text-white/65 mb-8 leading-relaxed">
            Open <strong className="text-white/72">Policy, Edit Policy</strong> in the dashboard and describe what personal data each system holds, why it holds it, who owns it and how long it may keep it. An industry policy pack can give you a reviewed starting point. No code change or restart is needed.
          </p>
          <CodeBlock filename="your-policy.json">{`{
  "org_id": "acme_retail",
  "fields": [
    {
      "field_name": "phone",
      "pii_category": "phone",
      "declared_purpose": "order_fulfillment",
      "consent_scope": "order_fulfillment",
      "retention_days": 1095,
      "source_system": "order-service"
    },
    {
      "field_name": "aadhaar",
      "pii_category": "aadhaar",
      "declared_purpose": "onboarding_kyc",
      "consent_scope": "onboarding_kyc",
      "retention_days": 180,
      "source_system": "partner-service",
      "data_since": "2025-12-24"
    }
  ],
  "owners": {
    "order-service": { "team": "Orders", "email": "orders@acme.example" },
    "partner-service": { "team": "KYC", "email": "kyc@acme.example" }
  },
  "notices": [
    { "notice_id": "n-core", "version": "3", "data_categories": ["phone"], "systems": ["*"] }
  ]
}`}</CodeBlock>
          <p className="mt-4 text-xs text-white/50 leading-relaxed">
            Policy changes are versioned. Every version keeps its timestamp, so changes to the policy are auditable too.
          </p>
        </div>
      </section>

      {/* CLI */}
      <section id="cli" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>CLI REFERENCE</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-8">veritas CLI commands</h2>
          <BentoCard className="p-0 overflow-hidden" delay={0}>
            {[
              { cmd: "veritas fingerprint", desc: "Print this machine's fingerprint. Send it to Veritas to receive your licence." },
              { cmd: "veritas license <path>", desc: "Install a signed .vlic licence file. On Linux and macOS this also starts the service." },
              { cmd: "veritas setup-code", desc: "Print a one-time code for the first-run setup page, which proves you have access to the server." },
              { cmd: "veritas start | stop | restart", desc: "Control the service." },
              { cmd: "veritas status", desc: "Show whether the service is running, and its health." },
              { cmd: "veritas logs", desc: "Stream the service log." },
              { cmd: "veritas check", desc: "Run health checks, including the licence." },
              { cmd: "veritas backup | backups", desc: "Create a backup, or list the backups you have." },
              { cmd: "veritas verify-backup <file>", desc: "Check that a backup is complete before you rely on it." },
              { cmd: "veritas restore <file>", desc: "Restore a backup. The restore itself is recorded in the evidence chain." },
              { cmd: "veritas support-bundle", desc: "Write a ZIP of diagnostics for your Veritas contact." },
              { cmd: "veritas version", desc: "Print the installed version." },
            ].map((item, i, arr) => (
              <div key={item.cmd} className={`flex items-start gap-6 p-5 ${i < arr.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                <code className="font-mono text-[11px] text-white/70 w-48 shrink-0">{item.cmd}</code>
                <span className="text-sm text-white/60 leading-relaxed">{item.desc}</span>
              </div>
            ))}
          </BentoCard>
        </div>
      </section>

      {/* Sub-page links */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-light tracking-tight mb-6">More documentation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/documentation/quickstart" className="block p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11] hover:border-white/25 transition-colors">
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-3">QUICKSTART</div>
              <p className="text-sm text-white/65">From a fresh server to your first finding and a verified audit pack.</p>
            </Link>
            <Link href="/documentation/user-guide" className="block p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11] hover:border-white/25 transition-colors">
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-3">USER GUIDE</div>
              <p className="text-sm text-white/65">Incidents, rules and approvals, evidence, audit packs, rights requests and roles.</p>
            </Link>
            <Link href="/documentation/troubleshooting" className="block p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11] hover:border-white/25 transition-colors">
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-3">TROUBLESHOOTING</div>
              <p className="text-sm text-white/65">Licence, service, agent, certificate and verification issues.</p>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

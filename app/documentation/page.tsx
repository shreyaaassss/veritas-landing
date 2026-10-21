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
            {"Install. License.\nStart monitoring."}
          </RevealText>
          <p className="mt-7 text-base text-white/60 leading-relaxed max-w-xl">
            Veritas v1.0.16  -  Installation guide, agent deployment, org config, and CLI reference.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Requirements", href: "#requirements" },
              { label: "Linux Install", href: "#linux" },
              { label: "macOS Install", href: "#macos" },
              { label: "Windows Install", href: "#windows" },
              { label: "Agent Deploy", href: "#agent" },
              { label: "Org Config", href: "#orgconfig" },
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
                <p className="text-sm text-white/65 leading-relaxed mb-6">Compliance engine, PII detection, evidence store, and dashboard. Install on one machine inside your network.</p>
                <div className="space-y-3">
                  {[
                    ["RAM", "2 GB minimum  -  4 GB recommended"],
                    ["Disk", "2 GB free"],
                    ["OS", "Ubuntu 22.04+ / macOS 12+ / Windows 10 / Server 2019+"],
                    ["Network", "No outbound required. Outbound HTTPS optional for AI investigation only."],
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
                <p className="text-sm text-white/65 leading-relaxed mb-6">Lightweight log forwarder. Deploy one agent per application server or Kubernetes node you want to monitor.</p>
                <div className="space-y-3">
                  {[
                    ["RAM", "128 MB"],
                    ["Disk", "50 MB"],
                    ["OS", "Ubuntu 18.04+ or any Linux  -  Docker and Kubernetes supported"],
                    ["Network", "Outbound access to the Veritas Server only (stays in your network)"],
                    ["Auth", "A registration key issued from the Veritas dashboard"],
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
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">Get your license ready</h2>
          <p className="text-sm text-white/65 leading-relaxed mb-6">
            Veritas requires a machine-bound license file (<code className="bg-white/[0.07] px-1 rounded font-mono text-[11px]">.vlic</code>). You&apos;ll get your machine fingerprint after installing, then send it to us to receive your license.
          </p>
          <BentoCard className="p-7" delay={0}>
            <div className="space-y-5">
              {[
                { n: "1", step: "Install Veritas (see steps below)" },
                { n: "2", step: "Run: sudo veritas fingerprint  -  copy the 64-character hash" },
                { n: "3", step: "Send the hash to your Veritas contact" },
                { n: "4", step: "Receive your signed veritas.vlic file" },
                { n: "5", step: "Run: sudo veritas license /path/to/veritas.vlic" },
                { n: "6", step: "Service starts automatically. Dashboard is available." },
              ].map(item => (
                <div key={item.n} className="flex items-start gap-4">
                  <span className="font-pixel text-[10px] text-white/40 tracking-widest shrink-0 w-4">{item.n}</span>
                  <span className="text-sm text-white/70">{item.step}</span>
                </div>
              ))}
            </div>
          </BentoCard>
          <p className="mt-4 text-xs text-white/50">
            Don&apos;t have a license yet? <Link href="/book-demo" className="underline text-white/65 hover:text-white">Book a demo</Link> and we&apos;ll issue one for your machine.
          </p>
        </div>
      </section>

      {/* Linux */}
      <section id="linux" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>LINUX</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">Ubuntu 22.04+ / Debian</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/65 mb-3">Install the .deb package:</p>
              <CodeBlock filename="terminal">{`sudo apt install ./veritas_1.0.16_amd64.deb`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Get your machine fingerprint:</p>
              <CodeBlock filename="terminal">{`sudo veritas fingerprint
# Output: v2:a3f8c2d1e9b47f6c8a...  (64 chars)
# Send this to your Veritas contact to receive your .vlic file`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Install the license and start the service:</p>
              <CodeBlock filename="terminal">{`sudo veritas license /path/to/veritas.vlic
# Service starts via systemd. Check status:
sudo systemctl status veritas`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Complete first-boot setup:</p>
              <CodeBlock filename="terminal">{`sudo veritas setup-code
# Visit http://your-server-ip:8000/setup
# Enter the setup code to create the first administrator account`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* macOS */}
      <section id="macos" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>MACOS</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">macOS 12+ (Apple Silicon)</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/65 mb-3">Open the installer package:</p>
              <CodeBlock filename="terminal">{`open Veritas-1.0.16.pkg
# Follow the installation wizard`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Get fingerprint and install license (same as Linux):</p>
              <CodeBlock filename="terminal">{`veritas fingerprint
veritas license /path/to/veritas.vlic`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">The service starts via launchd. Access setup:</p>
              <CodeBlock filename="terminal">{`veritas setup-code
# Visit http://localhost:8000/setup`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Windows */}
      <section id="windows" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>WINDOWS</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-6">Windows 10/11 · Server 2019/2022</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/65 mb-3">Run the installer:</p>
              <CodeBlock filename="cmd">{`VeritasSetup-1.0.16.exe
# Follow the installation wizard (includes Go launcher)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Get fingerprint and install license:</p>
              <CodeBlock filename="cmd">{`veritas fingerprint
veritas license C:\path\to\veritas.vlic`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-white/65 mb-3">Service runs via Windows SCM. Access setup:</p>
              <CodeBlock filename="cmd">{`veritas setup-code
# Visit http://localhost:8000/setup`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Agent */}
      <section id="agent" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>AGENT DEPLOYMENT</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-4">Deploy the Veritas Agent</h2>
          <p className="text-sm text-white/65 mb-8 leading-relaxed">
            Install one agent per application server you want to monitor. First, issue a registration key from the Veritas dashboard under <strong className="font-medium text-white/72">Agents → Issue Registration Key</strong>.
          </p>

          <div className="space-y-8">
            <div>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">OPTION 1: .DEB PACKAGE (LINUX)</div>
              <CodeBlock filename="terminal">{`sudo apt install ./veritas-agent_1.0.16_amd64.deb

# Create agent-config.yaml:
cat > /etc/veritas-agent/agent-config.yaml << EOF
veritas_address: https://veritas.your-company.internal
registration_key: KEY-FROM-DASHBOARD
sources:
  - type: file
    path: /var/log/your-app/*.log
  - type: docker
    container: your-app-container
EOF

sudo systemctl enable --now veritas-agent`}</CodeBlock>
            </div>

            <div>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">OPTION 2: DOCKER</div>
              <CodeBlock filename="docker-compose.yml">{`services:
  veritas-agent:
    image: veritas-agent:1.0.16
    environment:
      VERITAS_ADDRESS: https://veritas.your-company.internal
      REGISTRATION_KEY: KEY-FROM-DASHBOARD
    volumes:
      - /var/log:/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: unless-stopped`}</CodeBlock>
            </div>

            <div>
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-4">OPTION 3: KUBERNETES DAEMONSET</div>
              <CodeBlock filename="terminal">{`# Fill in your Veritas server address and registration key:
kubectl create secret generic veritas-agent-secret \\
  --from-literal=registration-key=KEY-FROM-DASHBOARD

kubectl create configmap veritas-agent-config \\
  --from-literal=veritas-address=https://veritas.your-company.internal

# Apply the DaemonSet (one agent per node):
kubectl apply -f veritas-agent/k8s/

# Verify agents appear in the dashboard:
kubectl get pods -l app=veritas-agent`}</CodeBlock>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-xl border border-amber-400/20 bg-amber-400/10">
            <p className="text-xs text-amber-300 leading-relaxed">
              Each agent appears in the dashboard under <strong>Agents</strong> with a heartbeat status. If an agent is compromised or decommissioned, click <strong>Revoke</strong> to immediately invalidate its token.
            </p>
          </div>
        </div>
      </section>

      {/* Org config */}
      <section id="orgconfig" className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto">
          <Tag>ORG CONFIG</Tag>
          <h2 className="mt-5 text-2xl font-light tracking-tight mb-4">Define your data policy</h2>
          <p className="text-sm text-white/65 mb-8 leading-relaxed">
            Upload a YAML config through the dashboard (<strong className="text-white/72">Policy → Upload Config</strong>) to describe what personal data each system holds, why it holds it, and how long it may retain it. No code change or restart needed.
          </p>
          <CodeBlock filename="your-org-config.yaml">{`org_id: acme_retail
fields:
  - field_name: phone
    pii_category: phone
    declared_purpose: order_fulfillment
    consent_scope: order_fulfillment
    retention_days: 1095               # 3 years
    source_system: order-service

  - field_name: aadhaar
    pii_category: aadhaar
    declared_purpose: onboarding_kyc
    consent_scope: onboarding_kyc
    retention_days: 180
    source_system: partner-service
    data_since: 2025-12-24             # system already holds data from this date

  - field_name: name
    pii_category: person_name
    declared_purpose: order_fulfillment
    consent_scope: order_fulfillment
    retention_days: 1095
    source_system: order-service

linkage_rules:
  - fields: [name, phone, delivery_address]  # together, these re-identify a person`}</CodeBlock>
          <p className="mt-4 text-xs text-white/50 leading-relaxed">
            Config changes are versioned. Every version is timestamped so policy changes are themselves auditable.
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
              { cmd: "veritas fingerprint", desc: "Print the machine fingerprint hash. Send this to Veritas to receive your license." },
              { cmd: "veritas license <path>", desc: "Install a signed .vlic license file. The service starts automatically if not running." },
              { cmd: "veritas setup-code", desc: "Print a one-time setup code for the /setup page (proves physical access to the server)." },
              { cmd: "veritas backup", desc: "Back up the evidence database and org configs to a .tar.gz archive." },
              { cmd: "veritas check", desc: "Validate the installed license (checks signature, expiry, and machine binding)." },
              { cmd: "veritas --port <n>", desc: "Start on a custom port (default: 8000). Used with run_pipeline.py for dev." },
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
              <p className="text-sm text-white/65">Get Veritas running in 5 steps from a fresh Ubuntu machine.</p>
            </Link>
            <Link href="/documentation/user-guide" className="block p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11] hover:border-white/25 transition-colors">
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-3">USER GUIDE</div>
              <p className="text-sm text-white/65">Dashboard walkthrough, case lifecycle, RBAC, and evidence export.</p>
            </Link>
            <Link href="/documentation/troubleshooting" className="block p-6 rounded-2xl border border-white/[0.09] bg-[#0e0f11] hover:border-white/25 transition-colors">
              <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-3">TROUBLESHOOTING</div>
              <p className="text-sm text-white/65">Common errors, license issues, agent connectivity problems.</p>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

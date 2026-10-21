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
          {copied ? "COPIED ✓" : "COPY"}
        </button>
      </div>
      <pre className="p-4 text-[13px] text-white/75 font-mono leading-relaxed overflow-x-auto whitespace-pre">{code}</pre>
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
            {"Get a verified agent\nrunning in minutes."}
          </RevealText>
          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-xl">
            This guide walks you through installing Veritas, writing your first agent, and running a verified execution with a full audit trail.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/50">
            <span>Prerequisites: Node.js 18+ or Python 3.9+</span>
            <span>·</span>
            <span>Time: ~10 minutes</span>
          </div>
        </div>
      </section>

      {/* Step nav */}
      <section className="sticky top-20 z-40 px-6 md:px-12 lg:px-20 py-3 border-y border-white/[0.08] bg-black/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-6 overflow-x-auto">
          {["Install", "Configure", "Define Agent", "Run", "Inspect Logs"].map((step, i) => (
            <a key={step} href={`#step-${i + 1}`} className="text-[11px] text-white/55 hover:text-white tracking-widest whitespace-nowrap transition-colors">
              {String(i + 1).padStart(2, "0")} {step}
            </a>
          ))}
        </div>
      </section>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-16 space-y-20">

        {/* Step 1 */}
        <section id="step-1">
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-pixel text-[11px] text-white/35 tracking-widest">01</span>
              <div>
                <h2 className="text-2xl font-light">Install the SDK</h2>
                <p className="mt-2 text-sm text-white/60">Install the Veritas SDK using your preferred package manager.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">npm</div>
                <CodeBlock code="npm install @veritas/sdk" language="bash" />
              </div>
              <div>
                <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">pnpm</div>
                <CodeBlock code="pnpm add @veritas/sdk" language="bash" />
              </div>
              <div>
                <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">Python</div>
                <CodeBlock code="pip install veritas-sdk" language="bash" />
              </div>
            </div>
          </BentoCard>
        </section>

        {/* Step 2 */}
        <section id="step-2">
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-pixel text-[11px] text-white/35 tracking-widest">02</span>
              <div>
                <h2 className="text-2xl font-light">Configure Veritas</h2>
                <p className="mt-2 text-sm text-white/60">Initialize a configuration file in your project root. This controls where logs are stored and what gets redacted.</p>
              </div>
            </div>
            <CodeBlock code={`npx veritas init\n\n# Creates veritas.config.json in your project root`} language="bash" />
            <div className="mt-5">
              <div className="text-[10px] text-white/45 tracking-widest uppercase mb-3">veritas.config.json</div>
              <CodeBlock code={`{
  "logDir": "./veritas-logs",
  "redact": ["apiKey", "token", "password", "secret"],
  "verify": true,
  "logLevel": "full"
}`} language="json" />
            </div>
            <div className="mt-5 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20">
              <p className="text-xs text-amber-300 leading-relaxed">
                <span className="font-medium">Note:</span> The <code className="bg-amber-400/15 px-1 rounded">redact</code> array matches against field names in your agent&apos;s tool calls. Any matching key will have its value replaced with <code className="bg-amber-400/15 px-1 rounded">[REDACTED]</code> in all logs.
              </p>
            </div>
          </BentoCard>
        </section>

        {/* Step 3 */}
        <section id="step-3">
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-pixel text-[11px] text-white/35 tracking-widest">03</span>
              <div>
                <h2 className="text-2xl font-light">Define your agent</h2>
                <p className="mt-2 text-sm text-white/60">Create an agent with a task, tools, and verification enabled.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">TypeScript</div>
                <CodeBlock code={`import { Agent, Tool, AuditLogger } from '@veritas/sdk'

// Define a tool  -  every call will be logged automatically
const fetchData = new Tool('fetch-data', async (url: string) => {
  const res = await fetch(url)
  return res.json()
})

// Attach audit logging
const logger = new AuditLogger({ level: 'full', redact: ['apiKey'] })

// Create the agent
export const extractor = new Agent({
  name: 'extractor',
  model: 'gpt-4o',       // or any supported model
  tools: [fetchData],
  verify: true,
})

extractor.use(logger)`} language="typescript" />
              </div>
              <div>
                <div className="text-[10px] text-white/45 tracking-widest uppercase mb-2">Python</div>
                <CodeBlock code={`from veritas import Agent, Tool, AuditLogger

# Define a tool
@Tool(name="fetch_data")
async def fetch_data(url: str) -> dict:
    import httpx
    async with httpx.AsyncClient() as client:
        return (await client.get(url)).json()

# Create agent with audit logging
logger = AuditLogger(level="full", redact=["api_key"])

extractor = Agent(
    name="extractor",
    model="gpt-4o",
    tools=[fetch_data],
    verify=True,
    logger=logger,
)`} language="python" />
              </div>
            </div>
          </BentoCard>
        </section>

        {/* Step 4 */}
        <section id="step-4">
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-pixel text-[11px] text-white/35 tracking-widest">04</span>
              <div>
                <h2 className="text-2xl font-light">Run your agent</h2>
                <p className="mt-2 text-sm text-white/60">Execute the agent with a task. Veritas captures the full trace automatically.</p>
              </div>
            </div>
            <CodeBlock code={`# Via CLI
veritas run --agent ./agents/extractor.ts --task "Extract the headline from https://example.com"

# Or programmatically
const result = await extractor.run({
  task: "Extract the headline from https://example.com"
})`} language="typescript" />
            <div className="mt-5 rounded-xl bg-[#141617] border border-white/[0.08] p-4">
              <div className="text-[10px] text-white/30 tracking-widest mb-3">Expected output</div>
              <div className="space-y-1.5 font-mono text-[12px]">
                <div className="text-white/40">  Starting agent: extractor</div>
                <div className="text-white/40">  Audit logging: enabled</div>
                <div className="text-white/40">  Verification: on</div>
                <div className="text-white/40">  ─────────────────────────</div>
                <div className="text-white/60">  tool_called:     fetch-data</div>
                <div className="text-white/60">  decision_logged: selected extraction strategy</div>
                <div className="text-white/60">  output_verified: ✓ schema valid</div>
                <div className="text-white/40">  ─────────────────────────</div>
                <div className="text-[#00cbaa]">✓ Run complete  -  1842ms</div>
                <div className="text-white/35">  Audit log: ./veritas-logs/run-001.json</div>
              </div>
            </div>
          </BentoCard>
        </section>

        {/* Step 5 */}
        <section id="step-5">
          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-pixel text-[11px] text-white/35 tracking-widest">05</span>
              <div>
                <h2 className="text-2xl font-light">Inspect the audit log</h2>
                <p className="mt-2 text-sm text-white/60">Every run produces a structured JSON audit record you can query, export, or inspect.</p>
              </div>
            </div>
            <CodeBlock code={`veritas inspect ./veritas-logs/run-001.json

# Or open the raw JSON directly
cat ./veritas-logs/run-001.json`} language="bash" />
            <div className="mt-5">
              <div className="text-[10px] text-white/45 tracking-widest uppercase mb-3">Sample audit record (abridged)</div>
              <CodeBlock code={`{
  "runId": "run-001",
  "agent": "extractor",
  "startedAt": "2024-10-13T10:00:00.001Z",
  "completedAt": "2024-10-13T10:00:01.843Z",
  "durationMs": 1842,
  "status": "success",
  "verified": true,
  "events": [
    {
      "type": "tool_called",
      "tool": "fetch-data",
      "args": { "url": "https://example.com" },
      "result": { "headline": "Example Domain" },
      "durationMs": 312
    },
    {
      "type": "decision",
      "description": "Selected extraction strategy: text parsing",
      "timestamp": "2024-10-13T10:00:01.120Z"
    }
  ],
  "output": { "headline": "Example Domain" }
}`} language="json" />
            </div>
          </BentoCard>
        </section>

        {/* Next steps */}
        <div className="pt-8 border-t border-white/[0.08]">
          <h2 className="text-2xl font-light mb-6">Next steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "User Guide", desc: "Learn all Veritas concepts in depth.", href: "/documentation/user-guide" },
              { label: "Configuration", desc: "All config options and environment variables.", href: "/documentation/configuration" },
              { label: "Troubleshooting", desc: "Common errors and how to fix them.", href: "/documentation/troubleshooting" },
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

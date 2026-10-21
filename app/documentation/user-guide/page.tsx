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

export default function UserGuidePage() {
  return (
    <SiteShell>
      

      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <Tag>USER GUIDE</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl font-light tracking-tight leading-[1.02]">
            {"Core concepts."}
          </RevealText>
          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-xl">
            A deep dive into how Veritas works  -  agents, tools, audit logs, access boundaries, and verification rules.
          </p>
          <div className="mt-6 p-4 rounded-xl border border-amber-400/20 bg-amber-400/10">
            <p className="text-xs text-amber-300">This guide is being written alongside the beta. Some sections are more complete than others. Last updated: October 2024.</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 pb-20 space-y-12">

        {/* Concepts */}
        {[
          {
            id: "agents",
            title: "Agents",
            content: `An Agent in Veritas is the central orchestration unit. It receives a task, uses tools to accomplish sub-goals, makes decisions, and produces an output.

Every agent has:
• A name  -  used in logs and audit records
• A model  -  the underlying LLM (e.g., gpt-4o, claude-3-5-sonnet)
• Tools  -  the functions the agent is permitted to call
• A verify flag  -  whether outputs should be validated before the run completes
• An optional AuditLogger instance

Agents are designed to be stateless between runs. All state is captured in the audit record.`,
          },
          {
            id: "tools",
            title: "Tools",
            content: `Tools are the functions your agent calls to interact with the outside world  -  fetching data, reading files, calling APIs, and so on.

In Veritas, every tool call is automatically logged with:
• Tool name
• Arguments passed (with redacted sensitive fields)
• Return value
• Duration in milliseconds
• Timestamp

You define a tool by wrapping any async function with the Tool constructor. The function signature becomes the tool's interface.

Tools can be flagged as verify: true to require output validation before the result is returned to the agent.`,
          },
          {
            id: "audit-logs",
            title: "Audit Logs",
            content: `Audit logs are the core output of every Veritas agent run. Each run produces a structured JSON document containing:

• Run metadata: ID, agent name, model, start/end time, duration, status
• Event stream: every tool call, decision point, and state transition in order
• Output: the final result with a link to the events that produced it
• Verification result: pass/fail and details if verify is enabled

Logs are written to the configured logDir (default: ./veritas-logs). Each run gets a uniquely named file (e.g., run-20241013-001.json).

You can query logs using the CLI:
  veritas inspect <log-file>
  veritas query --agent extractor --status success --since 2024-10-01`,
          },
          {
            id: "access-boundaries",
            title: "Access Boundaries",
            content: `Access boundaries define what an agent is and is not allowed to do. You specify this in the agent's configuration:

• allowedTools: array of tool names the agent may call
• deniedTools: tools the agent explicitly cannot call (takes precedence)
• maxCalls: maximum number of tool calls per run
• timeout: maximum duration for any single tool call

If an agent attempts to call a tool not in allowedTools, the attempt is blocked and logged with type: "access_denied". The run continues but the blocked call is recorded.

Note: Access boundaries are a beta feature. Some edge cases are still being addressed. See the troubleshooting guide for known limitations.`,
          },
          {
            id: "verification",
            title: "Verification",
            content: `When verify: true is set on an agent or tool, Veritas checks the output against a schema or rule before the run is marked complete.

You can define verification rules in veritas.config.json:

{
  "verify": {
    "schema": "./schemas/output.json",    // JSON schema
    "required": ["headline", "url"],      // required fields
    "maxOutputLength": 10000              // max characters
  }
}

If verification fails, the run status is set to "verified_failed" and the failure details are included in the audit record. The output is still returned  -  Veritas does not block the result, it annotates it.`,
          },
        ].map((concept, i) => (
          <BentoCard key={concept.id} className="p-8 md:p-10" delay={i * 40}>
            <h2 id={concept.id} className="text-2xl font-light mb-4">{concept.title}</h2>
            <div className="space-y-3">
              {concept.content.split("\n\n").map((para, j) => (
                <p key={j} className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{para}</p>
              ))}
            </div>
          </BentoCard>
        ))}

        {/* Nav */}
        <div className="pt-6 flex items-center justify-between border-t border-white/[0.08]">
          <Link href="/documentation/quickstart" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">← Quickstart</Link>
          <Link href="/documentation/troubleshooting" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">Troubleshooting →</Link>
        </div>
      </div>
    </SiteShell>
  )
}

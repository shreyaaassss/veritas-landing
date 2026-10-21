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

const ERRORS = [
  {
    code: "VERITAS_CONFIG_NOT_FOUND",
    severity: "error",
    desc: "No veritas.config.json found in the current directory or project root.",
    fix: "Run `npx veritas init` to create a default config, or specify the config path with --config <path>.",
  },
  {
    code: "TOOL_NOT_ALLOWED",
    severity: "warning",
    desc: "The agent attempted to call a tool that is not in its allowedTools list.",
    fix: "Add the tool name to the allowedTools array in your agent configuration, or remove the tool from the agent's tool list.",
  },
  {
    code: "REDACTION_FIELD_MISSING",
    severity: "info",
    desc: "A field specified in the redact array was not found in the tool call arguments.",
    fix: "This is not an error. It means the field simply wasn't present in this particular call. No action needed.",
  },
  {
    code: "VERIFICATION_FAILED",
    severity: "warning",
    desc: "The agent output did not pass the configured verification rules.",
    fix: "Check the 'verificationDetails' field in the audit log for which rule failed. Update your verification schema or adjust the agent's task prompt to produce output matching the expected schema.",
  },
  {
    code: "LOG_WRITE_PERMISSION",
    severity: "error",
    desc: "Veritas cannot write to the configured logDir directory.",
    fix: "Check that the logDir path exists and the process has write permission. You can change the logDir in veritas.config.json.",
  },
  {
    code: "MODEL_TIMEOUT",
    severity: "error",
    desc: "The LLM API call timed out. The run has been marked as failed.",
    fix: "Check your LLM provider's status page. If the issue persists, try increasing the modelTimeout value in your config, or reduce the complexity of the agent's task.",
  },
  {
    code: "AUDIT_LOG_CORRUPT",
    severity: "error",
    desc: "An existing audit log file appears to be malformed or incomplete (e.g., from a crashed run).",
    fix: "The file may be recoverable with `veritas repair <log-file>`. If not, the run will need to be re-executed. Partial logs are preserved for inspection.",
  },
]

const KNOWN_ISSUES = [
  {
    title: "Access boundaries not enforced on nested tool calls",
    status: "known-beta",
    desc: "When a tool internally calls another function, the inner call may not be subject to the allowedTools check. This is a beta limitation and is being addressed.",
    workaround: "Avoid wrapping tool calls inside other tools for now. Each tool should be a leaf operation.",
  },
  {
    title: "Streaming output logging may drop events under high throughput",
    status: "known-beta",
    desc: "When an agent produces a high volume of streaming output tokens, some intermediate streaming events may not appear in the audit log.",
    workaround: "Set streaming: false in your agent config if a complete audit trail is required. Non-streaming runs are fully captured.",
  },
  {
    title: "Python SDK does not support async tool timeouts yet",
    status: "known-beta",
    desc: "The toolTimeout configuration option works in the TypeScript SDK but is not yet implemented in the Python SDK.",
    workaround: "Implement timeouts manually within your Python tool functions using asyncio.wait_for().",
  },
]

export default function TroubleshootingPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <SiteShell>
      

      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <Tag>TROUBLESHOOTING</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl font-light tracking-tight leading-[1.02]">
            {"Common errors\nand fixes."}
          </RevealText>
          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-xl">
            If Veritas isn&apos;t working as expected, this guide covers the most common errors, their causes, and how to resolve them.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 pb-20 space-y-12">

        {/* Error catalog */}
        <section>
          <h2 className="text-2xl font-light mb-6">Error catalog</h2>
          <div className="space-y-3">
            {ERRORS.map((err) => {
              const isOpen = expanded === err.code
              const severityColor = err.severity === "error" ? "text-red-400 bg-red-500/10 border-red-400/25" : err.severity === "warning" ? "text-amber-300 bg-amber-400/10 border-amber-400/20" : "text-[#b6abff] bg-[#b6abff]/10 border-[#b6abff]/25"
              return (
                <BentoCard key={err.code} className="overflow-visible" delay={0}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : err.code)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <code className="text-[11px] font-mono text-white/65 bg-white/[0.06] px-2.5 py-1 rounded-lg">{err.code}</code>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityColor} tracking-widest uppercase`}>{err.severity}</span>
                    </div>
                    <span className="text-white/40 transition-transform duration-200" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? "400px" : "0px" }}>
                    <div className="px-6 pb-6 space-y-3">
                      <div>
                        <div className="text-[10px] text-white/45 tracking-widest uppercase mb-1.5">Description</div>
                        <p className="text-sm text-white/70 leading-relaxed">{err.desc}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/45 tracking-widest uppercase mb-1.5">How to fix</div>
                        <p className="text-sm text-white/70 leading-relaxed">{err.fix}</p>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              )
            })}
          </div>
        </section>

        {/* Known issues */}
        <section>
          <h2 className="text-2xl font-light mb-3">Known beta limitations</h2>
          <p className="text-sm text-white/60 mb-6">These are known issues in the current beta. We&apos;re actively working on all of them.</p>
          <div className="space-y-3">
            {KNOWN_ISSUES.map((issue, i) => (
              <BentoCard key={i} className="p-7" delay={i * 40}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-base font-light">{issue.title}</h3>
                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 tracking-widest uppercase">Beta</span>
                </div>
                <p className="text-sm text-white/65 leading-relaxed mb-3">{issue.desc}</p>
                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <span className="text-[10px] text-white/45 tracking-widest uppercase">Workaround: </span>
                  <span className="text-xs text-white/65">{issue.workaround}</span>
                </div>
              </BentoCard>
            ))}
          </div>
        </section>

        {/* Debug tips */}
        <section>
          <h2 className="text-2xl font-light mb-6">Debug tips</h2>
          <BentoCard className="p-8" delay={0}>
            <div className="space-y-5">
              {[
                { tip: "Enable verbose logging", detail: 'Set "logLevel": "verbose" in veritas.config.json to capture additional context in every event, including the full model prompt and response.' },
                { tip: "Inspect the raw log file", detail: "The JSON audit log contains every event in the run. Opening it directly in any JSON viewer gives you the full picture  -  more than the CLI summary." },
                { tip: "Use the sandbox for debugging", detail: "Run with `veritas run --sandbox` to execute in an isolated environment that does not write to your real log directory. Useful for testing without polluting your audit history." },
                { tip: "Check the run exit code", detail: "Veritas exits with code 0 for success, 1 for verification failure, and 2 for runtime errors. Use this in scripts to handle each case separately." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-5 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <div className="w-1 bg-white/10 rounded-full shrink-0 self-stretch" />
                  <div>
                    <div className="text-sm font-light mb-1.5">{item.tip}</div>
                    <p className="text-xs text-white/60 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </section>

        {/* Still stuck */}
        <div className="pt-6 border-t border-white/[0.08]">
          <p className="text-sm text-white/60 mb-4">Still stuck? We&apos;re happy to help.</p>
          <div className="flex gap-3">
            <Link href="/contact" className="px-6 py-3 bg-[#eef35f] text-black font-medium text-xs rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em]">Contact Us</Link>
            <a href="https://github.com/shreyaaassss/Veritas/issues" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/15 text-white/72 text-xs rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em]">OPEN An Issue ↗</a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <Link href="/documentation/user-guide" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">← User Guide</Link>
          <Link href="/documentation" className="text-xs text-white/55 hover:text-white tracking-widest transition-colors">All docs →</Link>
        </div>
      </div>
    </SiteShell>
  )
}

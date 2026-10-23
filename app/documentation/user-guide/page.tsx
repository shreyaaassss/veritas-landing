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

const CONCEPTS = [
  {
    id: "agents",
    title: "Agents and masking",
    content: `An agent runs on each application host. It reads log files, container logs, syslog and database statement logs, and forwards events to your Veritas server with its own token.

Each agent can treat each kind of personal data differently:
• mask: replace the value with a placeholder such as [AADHAAR_REDACTED]
• hash: replace it with a keyed hash such as [PHONE#…], so it can still be matched later
• drop: leave the line out entirely
• monitor: send the line as it is

If masking fails for a line, the agent drops that line rather than sending it raw. The Agents page shows each agent's heartbeat, buffer and masking mode, and you can revoke an agent at any time.`,
  },
  {
    id: "incidents",
    title: "Findings and incidents",
    content: `Each time a rule catches personal data, Veritas records a finding with the rule, the field, the system and a masked snippet.

Findings of the same kind, in the same place, are grouped into one incident and owned by the team you named for that system. Incidents move from OPEN to ACKNOWLEDGED to RESOLVED. If findings for a resolved incident appear again after the grace period, the incident reopens and is marked as recurred.

Nothing is thrown away. The All findings view lists every finding behind every incident.`,
  },
  {
    id: "rules",
    title: "Rules and approvals",
    content: `Each rule describes a possible control failure in plain language. It is a technical signal, not a legal conclusion.

• Personal data where it should not be, such as in a log
• Personal data without a matching declaration in your policy
• Data held longer than the policy declares
• Fields that identify a person together
• An erased identifier that appears again
• Data that no current notice covers

Core rules cannot be switched off. You can raise a rule's severity, lower it only as far as the floor for that kind of data, add actions such as a review task, or record a time-bound exception. Every change needs a second administrator's approval and is written into the evidence chain. For any finding, Why this fired shows the rule's reasoning step by step.`,
  },
  {
    id: "evidence",
    title: "Evidence and anchoring",
    content: `Every finding, incident change and rule approval is appended to your organisation's evidence chain. Each record stores the hash of the record before it, and the records are encrypted at rest.

At intervals, Veritas signs a checkpoint of the chain and copies it to the witnesses you configure: a separate folder, a syslog server or SIEM, a mailbox or a time-stamp authority. The witnesses keep copies that the server cannot quietly rewrite.

The Verify Cryptographic Hash Chain button checks the chain on the server. The stand-alone verifier, veritas-verify, goes further: it compares the evidence with the signed checkpoints, so it also catches someone who rewrote the database and recomputed every hash. Records written after the last checkpoint are covered once the next checkpoint is signed.`,
  },
  {
    id: "audit-pack",
    title: "The audit pack",
    content: `Download audit pack, on the Audit Ledger, produces one zip that an auditor or a customer's security team can check without Veritas: no server, no network and no login.

• evidence.jsonl: the whole chain
• checkpoints.jsonl and veritas.pub: the signed checkpoints and the key that verifies them
• SUMMARY.md: what the evidence shows, and what it does not prove
• VERIFY.md and verify.sh: how to run the stand-alone verifier
• MANIFEST.sha256: a hash of every file, so a changed file is noticed

Every download is recorded in the audit log.`,
  },
  {
    id: "rights",
    title: "Rights requests",
    content: `Look up an identifier, such as a phone number, to see which systems Veritas has observed it in. The lookup works on keyed hashes, so the number itself is never stored.

Open a request and Veritas creates a task for each system's owner. When every task is confirmed, the request closes with a signed record that lists the evidence it rests on.

After an erasure request closes, Veritas keeps watching. If the identifier appears again, in any format, it raises an alert.`,
  },
  {
    id: "data-map",
    title: "Data map, retention and notices",
    content: `The Data map shows what Veritas has observed in each system, set against what your policy declares. It describes what was seen in the data Veritas received, not everything that exists.

Retention review lists systems where data is still seen after its declared period, with a task for the owner. Notice coverage shows whether a current notice you recorded covers each kind of data that was observed.`,
  },
  {
    id: "roles",
    title: "Roles",
    content: `• SUPER_ADMIN manages organisations, users and agents
• COMPLIANCE_ADMIN manages users, incidents and the data policy within an organisation
• AUDITOR reviews incidents and evidence, and downloads the audit pack
• VIEWER has read-only access to the dashboard

Roles are enforced on the server, and administrative actions are written to the audit log.`,
  },
]

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
            How Veritas works, concept by concept: agents, incidents, rules, evidence, audit packs and rights requests.
          </p>
          <div className="mt-6 p-4 rounded-xl border border-white/[0.09] bg-white/[0.04]">
            <p className="text-xs text-white/60">This guide describes the current release of Veritas. Last updated: October 2026.</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 pb-20 space-y-12">

        {CONCEPTS.map((concept, i) => (
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

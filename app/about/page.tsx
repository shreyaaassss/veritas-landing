"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
import { RevealText } from "@/components/reveal-text"
import { PixelIcon } from "@/components/pixel-icon"
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
    <div ref={ref} className={`rounded-2xl border border-white/[0.09] bg-[#0e0f11] overflow-hidden hover:border-white/[0.18] hover:bg-[#141617] transition-colors ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s` }}>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06]">{children}</span>
}

export default function AboutPage() {
  return (
    <SiteShell>
      

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Tag>ABOUT</Tag>
          <RevealText className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02]">
            {"Evidence,\nnot assurances."}
          </RevealText>
          <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl">
            Veritas began with India&apos;s Digital Personal Data Protection Act, 2023: a real and urgent problem, with no good self-hosted tooling for the engineers who live with it. We built the evidence layer we wanted, one that finds personal data where it leaks, stops it at the source, and keeps a record that anyone can check.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8 pb-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <BentoCard className="p-10 md:p-14 overflow-hidden relative" delay={0}>
            {/* Iridescent image accent */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-2/5 pointer-events-none opacity-60">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/analyst-Ysxnqg7Fpy2cfA56PiIttv1KximMhT.png"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0e0f11 0%, transparent 60%)" }} />
            </div>
            <p className="relative z-10 text-2xl md:text-3xl font-light leading-relaxed text-white/80 max-w-2xl">
              &ldquo;Personal data moves faster than any policy document. We built Veritas so that engineering teams can see where it goes, stop it at the source, and hand anyone who asks a record they can check for themselves, without that data ever coming to us.&rdquo;
            </p>
          </BentoCard>
        </div>
      </section>

      {/* The problem we solve */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>THE PROBLEM WE SOLVE</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">
            {"Good intentions\ndo not scale."}
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: "platform" as const,
                title: "Policies drift away from systems",
                desc: "The policy says which system holds which data and why. Months later, a new column, a debug line or a copied table says something different, and nobody notices.",
                delay: 0,
              },
              {
                icon: "workflow" as const,
                title: "Manual review does not scale",
                desc: "A company with a handful of services writes millions of log lines a day. No team can read them for personal data, undeclared processing and retention as they happen.",
                delay: 80,
              },
              {
                icon: "integrations" as const,
                title: "Generic tools were not built for this",
                desc: "SIEM and DLP products are not built around declared purposes, retention periods, erasure requests or Indian identifiers. Making them fit takes months of custom work.",
                delay: 0,
              },
              {
                icon: "pricing" as const,
                title: "Evidence has to stand on its own",
                desc: "When someone asks how you know your data was handled correctly, a spreadsheet is not enough. The record has to show an outsider that it was never changed.",
                delay: 80,
              },
            ].map((item) => (
              <BentoCard key={item.title} className="p-8" delay={item.delay}>
                <div className="mb-4"><PixelIcon type={item.icon} size={32} /></div>
                <h3 className="text-lg font-light mb-4">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Design principles */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>DESIGN PRINCIPLES</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-12">{"How we built it."}</RevealText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                n: "01",
                icon: "agents" as const,
                title: "Personal data stays in your network",
                desc: "Agents send only to your own Veritas server, and can mask personal data before it leaves the host. Outside the server, only signed checkpoints travel, and they carry hashes rather than data.",
                delay: 0,
              },
              {
                n: "02",
                icon: "workflow" as const,
                title: "Policy, not code",
                desc: "Each organisation declares its data policy as configuration. The same software serves every customer, and every version of the policy is kept, so policy changes are auditable too.",
                delay: 80,
              },
              {
                n: "03",
                icon: "pricing" as const,
                title: "Tamper-evident by design",
                desc: "Records are chained, checkpoints are signed, and witnesses outside the server keep their own copies. Auditors can check the evidence with their own tools, without trusting us.",
                delay: 160,
              },
              {
                n: "04",
                icon: "platform" as const,
                title: "Honest about what it shows",
                desc: "Every rule is described as a technical signal, not a legal conclusion. The audit pack says what it does not prove, and the data map shows what was observed rather than claiming to show everything.",
                delay: 0,
              },
              {
                n: "05",
                icon: "integrations" as const,
                title: "Built for Indian identifiers",
                desc: "Aadhaar validated with the Verhoeff checksum, PAN structure checks, Indian phone numbers and keyed hashes for rights requests. Built for the data Indian teams actually handle, not adapted from a generic tool.",
                delay: 80,
              },
              {
                n: "06",
                icon: "agents" as const,
                title: "Runs on what you already have",
                desc: "A spare VM, a Mac or a Windows Server box. Veritas needs no cloud account and no special hardware, and installers for Linux, macOS and Windows get you running on your own machines.",
                delay: 160,
              },
            ].map((item) => (
              <BentoCard key={item.n} className="p-7" delay={item.delay}>
                <div className="mb-4"><PixelIcon type={item.icon} size={32} /></div>
                <div className="font-pixel text-[10px] text-white/35 tracking-widest mb-3">{item.n}</div>
                <h3 className="text-base font-light mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <Tag>TEAM</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-10">{"Built by Demo Gods."}</RevealText>

          <BentoCard className="p-8 md:p-10" delay={0}>
            <div className="font-pixel text-[10px] text-white/40 tracking-widest mb-6">DEMO GODS</div>
            <div className="space-y-4">
              {["Shreyas Dhumal", "Namrata Wagh", "Manasi Patil", "Ayush Pisal"].map((name, i) => (
                <div key={name} className="flex items-baseline gap-5 pb-4 border-b border-white/[0.07] last:border-0 last:pb-0">
                  <span className="font-pixel text-[10px] text-white/35 tracking-widest shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-light text-white/85">{name}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </section>


      {/* CTAs */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <Link href="/book-demo" className="flex-1 px-8 py-4 bg-[#eef35f] text-black font-medium text-sm rounded-full hover:bg-[#f4f78a] transition-colors tracking-[0.012em] text-center">BOOK A Demo</Link>
          <Link href="/contact" className="flex-1 px-8 py-4 border border-white/15 text-white/72 text-sm rounded-full font-medium hover:border-white/30 hover:text-white transition-all tracking-[0.012em] text-center">Contact Us</Link>
        </div>
      </section>
    </SiteShell>
  )
}

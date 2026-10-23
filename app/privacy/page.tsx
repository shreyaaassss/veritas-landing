"use client"

import React, { useRef, useEffect, useState } from "react"
import { SiteShell } from "@/components/site-shell"
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

function Section({ children, id, delay = 0 }: { children: React.ReactNode; id: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <section id={id} ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      

      <div className="pt-40 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-white/55 bg-white/[0.06] mb-5">PRIVACY</span>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.02] mb-6">Privacy Policy</h1>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Last updated: October 2026
            </p>
            <div className="p-5 rounded-2xl border border-white/[0.09] bg-[#0e0f11]">
              <p className="text-sm text-white/72 leading-relaxed">
                Veritas is self-hosted software. <strong className="font-medium">The Veritas software does not send your data to us.</strong> Findings and evidence are stored on your own servers. This policy explains that, and covers the data this website collects when you create an account, request a download or contact us.
              </p>
            </div>
          </div>

          {/* TOC */}
          <div className="mb-12 p-5 rounded-xl border border-white/[0.09] bg-[#0e0f11]">
            <div className="text-[10px] text-white/45 tracking-widest uppercase mb-3">Contents</div>
            <div className="space-y-1.5">
              {[
                ["what-we-collect", "What data Veritas collects"],
                ["local-data", "Local data storage"],
                ["no-telemetry", "No telemetry by default"],
                ["accounts", "Accounts and download requests"],
                ["contact-forms", "Contact form data"],
                ["third-parties", "Third-party services"],
                ["changes", "Changes to this policy"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="flex text-sm text-white/60 hover:text-white transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="prose prose-sm max-w-none space-y-12">

            <Section id="what-we-collect" delay={0}>
              <h2 className="text-2xl font-light mb-4">What data Veritas collects</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>The Veritas software, meaning the server, the agents and the command-line tools, <strong className="text-white/80">does not send us any personal data</strong>. It does not send telemetry, usage statistics or crash reports to us.</p>
                <p>Veritas the website (this site) may log standard server access logs (IP address, browser, request path) via the hosting provider. These logs are used only for operational purposes and are not sold or shared.</p>
              </div>
            </Section>

            <Section id="local-data" delay={40}>
              <h2 className="text-2xl font-light mb-4">Local data storage</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>When you run Veritas, the evidence it keeps is stored on your own server. It contains:</p>
                <ul className="space-y-1.5 ml-4">
                  {["Findings, with personal data values masked", "Keyed hashes used for rights lookups and erasure checks", "Incident status, comments and the administrative audit log", "The evidence chain and its signed checkpoints"].map(item => (
                    <li key={item} className="flex items-start gap-2.5"><span className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />{item}</li>
                  ))}
                </ul>
                <p>This data stays on infrastructure you control. Veritas, the company, has no access to it. Witnesses you configure receive signed checkpoints, which carry hashes of the evidence rather than personal data.</p>
              </div>
            </Section>

            <Section id="no-telemetry" delay={80}>
              <h2 className="text-2xl font-light mb-4">No telemetry by default</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>The Veritas software does not include telemetry, analytics or tracking code, and makes no calls to analytics services.</p>
                <p>If a future version adds opt-in telemetry, it will be clearly documented and switched off by default.</p>
              </div>
            </Section>

            <Section id="accounts" delay={100}>
              <h2 className="text-2xl font-light mb-4">Accounts and download requests</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>To download Veritas you register with your Google account. Before sign-in we show a consent notice under India&apos;s Digital Personal Data Protection Act, 2023, and we only proceed once you tick the consent box. We record when you consented and which version of the notice you saw.</p>
                <ul className="space-y-1.5 ml-4">
                  {[
                    "What we collect: your name and Gmail address from Google, and the operating system and time of each download request.",
                    "Why: to email you the installation guide for the OS you choose, and to keep a record of requests so we can support your installation and licensing. Not for marketing, and never sold.",
                    "Who processes it for us: Google (sign-in), Supabase (account and request records), Resend (email delivery) and Cloudflare (hosting).",
                    "How long: until you withdraw consent or delete your account.",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5"><span className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />{item}</li>
                  ))}
                </ul>
                <p>You can access, correct or erase your data, nominate someone to act on your behalf, and withdraw consent at any time. To withdraw and erase everything, sign in and choose <strong className="text-white/80">Withdraw consent &amp; delete data</strong> from the account menu. For anything else, or to raise a grievance, write to <a href="mailto:privacy@agentveritas.in" className="underline hover:text-white/80">privacy@agentveritas.in</a>. If we don&apos;t resolve your grievance, you can complain to the Data Protection Board of India.</p>
              </div>
            </Section>

            <Section id="contact-forms" delay={120}>
              <h2 className="text-2xl font-light mb-4">Contact form data</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>If you submit a contact or demo request form on this website, the information you provide (name, email, message) is used only to respond to your inquiry. It is not sold, shared with third parties, or added to marketing lists.</p>
                <p>We retain contact form submissions only as long as necessary to respond and follow up.</p>
              </div>
            </Section>

            <Section id="third-parties" delay={160}>
              <h2 className="text-2xl font-light mb-4">Third-party services</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>This website is hosted on Cloudflare, which may process standard access logs. Accounts use Google sign-in through Supabase, and installation emails are sent with Resend. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">Cloudflare</a>, <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">Supabase</a> and <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">Resend</a> privacy policies.</p>
                <p>Optional features of the Veritas software that you choose to enable, such as AI explanations, a time-stamp authority or an email witness, contact the service you configure. Each one is off unless you turn it on, and what it sends is described in the documentation. Those services&apos; own privacy policies apply when you use them.</p>
              </div>
            </Section>

            <Section id="changes" delay={200}>
              <h2 className="text-2xl font-light mb-4">Changes to this policy</h2>
              <p className="text-sm text-white/70 leading-relaxed">We may update this policy as Veritas evolves. Material changes will be noted with an updated date at the top of this page.</p>
            </Section>

            <Section id="contact" delay={240}>
              <h2 className="text-2xl font-light mb-4">Contact</h2>
              <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                <p>Questions about this privacy policy?</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm text-white/72 hover:text-white tracking-widest transition-colors underline">
                  Contact us →
                </Link>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </SiteShell>
  )
}

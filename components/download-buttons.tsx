"use client"

import Link from "next/link"
import { ArrowRight, Boxes, Check, LayoutDashboard, Loader2, Mail, Monitor, Terminal } from "lucide-react"
import { useAuth, type Os } from "@/components/auth"

const OPTIONS: { os: Os; icon: typeof Terminal; label: string; pkg: string }[] = [
  { os: "linux", icon: Terminal, label: "Linux", pkg: "Ubuntu 22.04+ / Debian" },
  { os: "macos", icon: Monitor, label: "macOS", pkg: "macOS 12+ (Apple Silicon only, Intel not supported)" },
  { os: "windows", icon: LayoutDashboard, label: "Windows", pkg: "Windows 10/11, Server 2019+" },
]

export function DownloadButtons() {
  const { session, downloads, requestDownload, register } = useAuth()

  return (
    <>
      <div className="tg-platforms">
        {OPTIONS.map(({ os, icon: Icon, label, pkg }) => {
          const st = downloads[os] ?? { state: "idle" }
          return (
            <div key={os} className="tg-platform">
              <Icon />
              <b>{label}</b>
              <span className="tg-body-sm">{pkg}</span>
              <button
                type="button"
                className="tg-btn tg-btn-primary tg-btn-sm"
                onClick={() => requestDownload(os)}
                disabled={st.state === "sending"}
                aria-label={`Request Veritas installer for ${label}`}
              >
                {st.state === "sending" ? <><Loader2 className="tg-spin-icon" /> Sending…</> : st.state === "sent" ? <><Check /> Sent</> : <>Request installer</>}
              </button>
              <span aria-live="polite">
                {st.state === "sent" && <span className="tg-dl-note ok"><Mail size={13} /> Guide sent to {st.email}</span>}
                {st.state === "error" && <span className="tg-dl-note err">{st.message}</span>}
              </span>
            </div>
          )
        })}
        <div className="tg-platform">
          <Boxes />
          <b>Kubernetes</b>
          <span className="tg-body-sm">Agent as a DaemonSet</span>
          <Link href="/documentation#agent" className="tg-btn tg-btn-text tg-btn-sm" style={{ paddingInline: 0 }}>Read the guide <ArrowRight /></Link>
        </div>
      </div>
      <p className="tg-body-sm tg-dl-auth">
        {session
          ? <>Signed in as {session.user.email}. The installer guide goes to this address.</>
          : <>A free account is needed to receive the installer guide. Google Workspace (work email) and personal Gmail both work: <button type="button" onClick={register}>sign in with Google</button>.</>}
      </p>
    </>
  )
}

"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { loginAction, AuthState } from "@/lib/actions/auth";
import { Shield, KeyRound, Mail, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-archive-white text-expedition-ink p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <BrandMark variant="compact" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate hover:text-deep-teal transition-colors"
        >
          <span>Return to Public Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Authentication Box */}
      <main className="max-w-md w-full mx-auto my-auto space-y-6">
        <div className="bg-paper-white rounded-xl p-6 sm:p-8 hairline-border polar-card-shadow space-y-6">
          {/* Card Header */}
          <div className="space-y-1.5 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EBF2F5] text-deep-teal flex items-center justify-center mx-auto mb-2 hairline-border">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-mono text-[11px] text-deep-teal uppercase tracking-widest font-semibold block">
              Authorized Access Only
            </span>
            <h1 className="text-2xl font-bold text-expedition-ink">
              Station Admin Console
            </h1>
            <p className="text-xs text-slate">
              Sign in with an approved administrator account to upload, review, and publish resources.
            </p>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="p-3 rounded-md bg-fjord-rose/10 border border-fjord-rose/30 flex items-start gap-2.5 text-xs text-fjord-rose">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Login Form */}
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  
                  placeholder="Your administrator email"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-semibold uppercase text-slate">
                  Access Key / Password
                </label>
                <span className="text-[11px] text-slate">For password help, contact the project owner.</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded-md bg-deep-teal hover:bg-[#12565A] active:bg-[#0D4144] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{isPending ? "Validating Session..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Demo Hint Banner */}
          <div className="p-3 rounded-lg bg-[#F7F9FA] hairline-border space-y-1 text-[11px] text-slate font-mono">
            <span className="font-semibold text-deep-teal block">
              APPROVED ACCOUNTS ONLY:
            </span>
            <p>
              The project owner must create your login and approve administrator access. Sample credentials do not work.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center pt-6 font-mono text-[11px] text-slate">
        <span>g-SAP prototype · Approved administrators only</span>
      </footer>
    </div>
  );
}

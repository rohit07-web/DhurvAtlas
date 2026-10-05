"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import {
  Search,
  Compass,
  BookOpen,
  Image as ImageIcon,
  ScrollText,
  Info,
  ShieldCheck,
  User,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Knowledge Library", href: "/library", icon: BookOpen },
    { label: "Media", href: "/media", icon: ImageIcon },
    { label: "Stories", href: "/stories", icon: ScrollText },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-archive-white text-expedition-ink antialiased">
      <aside className="px-4 py-3 bg-amber-50 border-b text-sm text-center">g-SAP prototype. Station readings, expedition displays and gallery images are illustrative; no live monitoring or independent scientific verification is provided. Library resources and outreach stories are published by administrators.</aside>
      {/* Sticky Header */}
      <header className="sticky top-0 w-full z-50 bg-archive-white/95 backdrop-blur-md hairline-b polar-card-shadow">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandMark variant="compact" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[14px] font-medium transition-colors ${
                      isActive
                        ? "text-deep-teal font-semibold"
                        : "text-slate hover:text-expedition-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            {/* Live Station Coordinates Telemetry Chip */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[#EBF2F5] text-slate font-mono text-[11px] hairline-border">
              <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
              <span>Illustrative atlas · g-SAP</span>
            </div>

            {/* Search Quick Action */}
            <Link
              href="/library"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#ECEEEF] hover:bg-[#E1E3E4] text-slate hover:text-expedition-ink transition-colors text-xs font-mono hairline-border"
              title="Quick Search"
            >
              <Search className="w-3.5 h-3.5 text-deep-teal" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] bg-white px-1.5 py-0.5 rounded hairline-border text-slate">
                ⌘K
              </kbd>
            </Link>

            {/* Admin Portal Gateway */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate hover:bg-[#ECEEEF] hover:text-expedition-ink text-[13px] font-medium transition-colors hairline-border"
            >
              <ShieldCheck className="w-4 h-4 text-deep-teal" />
              <span>Admin Portal</span>
            </Link>

            {/* Admin Quick Icon */}
            <Link
              href="/login"
              className="w-8 h-8 rounded-full bg-deep-teal flex items-center justify-center text-white hover:bg-[#12565A] transition-colors shrink-0 shadow-sm"
              title="Admin Console"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-slate hover:text-expedition-ink"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-paper-white hairline-b px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 text-sm font-medium text-slate hover:text-expedition-ink"
              >
                <link.icon className="w-4 h-4 text-deep-teal" />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-2 hairline-t flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-medium text-deep-teal"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Station Admin Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Deep Archival Footer */}
      <footer className="w-full bg-expedition-ink text-archive-white py-12 hairline-t">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#24343F]">
            {/* Col 1 & 2: Brand & Mission */}
            <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
              <BrandMark theme="dark" />
              <p className="text-[14px] text-[#A2B1BC] leading-relaxed max-w-md">
                Dhruv Atlas is an open-access polar science repository and outreach
                prototype for sharing publisher-supplied resources about Antarctica, the Arctic, and the Himalayas.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[#DCE3E7] font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-cryo-forest" />
                <span>g-SAP prototype · Source metadata supplied by publishers</span>
              </div>
            </div>

            {/* Col 3: Archive Collections */}
            <div className="space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#A2B1BC]">
                Archive Collections
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link
                    href="/library?type=Report"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Reports & Bulletins
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library?type=Dataset"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Datasets & Cryo-Layers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library?type=Media"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Field Media Archive
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stories"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Expedition Dispatches
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Geographical Regions */}
            <div className="space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#A2B1BC]">
                Geographical Regions
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link
                    href="/library?region=Antarctica"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Maitri & Bharati / Antarctica
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library?region=Arctic"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Himadri Station / Arctic
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library?region=Himalaya"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Chandra Taal / Himalaya
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library?region=Southern+Ocean"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Southern Ocean Transects
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: Governance */}
            <div className="space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#A2B1BC]">
                Governance
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link
                    href="/about"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Charter & Ethics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    About g-SAP Consortium
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[#DCE3E7] hover:text-white transition-colors"
                  >
                    Citation Policy & DOIs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="text-[#DCE3E7] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Station Admin Console</span>
                    <ExternalLink className="w-3 h-3 text-slate" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Attribution Bar */}
          <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px] text-[#A2B1BC]">
            <div>
              Built by team g-SAP · Prototype Demonstration Edition · Illustrative displays and publisher-supplied resources.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[#6F797A]">DATUM: WGS 84</span>
              <span className="text-[#6F797A]">NODE: IND-CRY-01</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

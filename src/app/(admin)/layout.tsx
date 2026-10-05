"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";
import BrandMark from "@/components/BrandMark";
import {
  LayoutDashboard,
  FolderOpen,
  UploadCloud,
  Compass,
  CheckCircle2,
  Megaphone,
  UserCheck,
  Settings,
  ExternalLink,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Shield,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render standalone authentication container
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const adminNavItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Content Library", href: "/admin/content", icon: FolderOpen },
    { label: "Upload Content", href: "/admin/upload", icon: UploadCloud },
    { label: "Expeditions & Stations", href: "/admin/expeditions", icon: Compass },
    {
      label: "Review & Publish", badge: undefined,
      href: "/admin/review",
      icon: CheckCircle2,
      
    },
    { label: "Outreach Studio", href: "/admin/outreach", icon: Megaphone },
    {
      label: "Administrator Access",
      href: "/admin/administrators",
      icon: UserCheck,
    },
    { label: "Activity & Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-archive-white text-expedition-ink antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-expedition-ink/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-paper-white hairline-r flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Admin Header with Brand */}
          <div className="h-16 px-5 hairline-b flex items-center justify-between">
            <Link href="/admin">
              <BrandMark variant="compact" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate hover:text-expedition-ink"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Node Scope Indicator */}
          <div className="px-5 py-3 hairline-b bg-[#F7F9FA]">
            <div className="flex items-center justify-between text-xs font-mono text-slate">
              <span className="flex items-center gap-1.5 font-medium text-deep-teal">
                <Shield className="w-3.5 h-3.5" />
                ADMIN CONSOLE
              </span>
              <span className="bg-[#DCE3E7] px-1.5 py-0.5 rounded text-[10px] text-expedition-ink font-semibold">
                SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate mt-1">
              Polar Knowledge Prototype
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {adminNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-deep-teal text-white shadow-sm"
                      : "text-slate hover:bg-[#F2F4F5] hover:text-expedition-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-slate"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                        isActive
                          ? "bg-white text-deep-teal"
                          : "bg-deep-teal text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link to Public Website */}
        <div className="p-4 hairline-t space-y-2 bg-[#F7F9FA]">
          <Link
            href="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-paper-white hairline-border text-[12px] font-medium text-slate hover:text-deep-teal hover:border-deep-teal transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-deep-teal" />
              <span>View Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate" />
          </Link>

          {/* Logged in admin card */}
          <div className="flex items-center gap-3 p-2 rounded-md bg-paper-white hairline-border">
            <div className="w-8 h-8 rounded-full bg-deep-teal text-white flex items-center justify-center font-bold text-xs">
              DA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-expedition-ink truncate">
                Administrator
              </p>
              <p className="text-[10px] font-mono text-slate truncate">
                Approved account
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-paper-white hairline-b flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate hover:text-expedition-ink"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate">
              <span>PORTAL</span>
              <span>/</span>
              <span className="text-expedition-ink font-semibold">
                ADMINISTRATOR WORDAPACE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search admin records, stations, DOIs..."
                className="pl-9 pr-3 py-1.5 text-xs bg-[#F7F9FA] rounded-md hairline-border focus:outline-none focus:border-deep-teal w-64"
              />
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate hover:text-deep-teal hover:bg-[#F7F9FA] hairline-border"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Portal</span>
            </Link>

            <button
              className="p-2 rounded-md hover:bg-[#F7F9FA] text-slate transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-deep-teal absolute top-1.5 right-1.5" />
            </button>

            <form action={logoutAction}><button title="Sign Out" className="p-2"><LogOut className="w-4 h-4" /></button></form>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

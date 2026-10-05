"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useResources } from "@/lib/use-resources";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TELEMETRY_FEED,

  REGIONS_META,
  PolarRecord,
} from "@/lib/mockData";
import {
  Search,
  ArrowRight,
  ChevronRight,
  Compass,
  FileText,
  Database,
  BookOpen,
  SlidersHorizontal,
  ExternalLink,
  Download,
  Terminal,
  Activity,
  MapPin,
  CheckCircle,
  Layers,
  Sparkles,
  Info,
  Shield,
} from "lucide-react";

export default function HomePage() {
  const { records, notice } = useResources();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  const quickChips = [
    "Schirmacher Oasis",
    "Himadri Arctic Station",
    "Glacier Mass Balance",
    "Cryosphere Core Logs",
    "Atmospheric Boundary Layer",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/library");
    }
  };

  const handleChipClick = (chip: string) => {
    router.push(`/library?q=${encodeURIComponent(chip)}`);
  };

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.getElementById(
          "archive-search-input"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredRecords =
    selectedType === "All"
      ? records.slice(0, 4)
      : records.filter((r) => r.type === selectedType).slice(0, 4);

  return (
    <div className="w-full flex flex-col">
      {notice && <p role="status" className="p-4 text-center bg-white border-b">{notice}</p>}
      {/* 1. Regional Ticker / Status Bar */}
      <section className="w-full bg-[#F2F4F5] hairline-b">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-y-2 text-slate font-mono text-[11px]">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-deep-teal font-semibold">
              <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
              ILLUSTRATIVE TELEMETRY
            </span>
            <span className="text-contour-grey hidden sm:inline">|</span>
            {TELEMETRY_FEED.map((feed, idx) => (
              <React.Fragment key={feed.station}>
                <span className="text-expedition-ink">
                  <strong className="font-semibold">{feed.station}:</strong>{" "}
                  {feed.temp} · {feed.wind}
                </span>
                {idx < TELEMETRY_FEED.length - 1 && (
                  <span className="text-contour-grey hidden md:inline">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-3 text-slate">
            <span className="hidden sm:inline">DEMO TELEMETRY</span>
            <span className="px-2 py-0.5 rounded bg-white hairline-border font-semibold text-deep-teal">
              v2.4.9 RELEASE
            </span>
          </div>
        </div>
      </section>

      {/* 2. Hero Section (Editorial + Polar Visual Plinth) */}
      <section className="w-full bg-archive-white py-12 lg:py-16">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Headline & Editorial Context */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EBF2F5] text-deep-teal font-mono text-xs hairline-border">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-medium">
                  THREE-POLE ARCHIVAL INITIATIVE
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] lg:leading-[1.1] font-normal text-expedition-ink tracking-tight">
                Explore the science of the{" "}
                <span className="font-serif italic font-normal text-deep-teal">
                  frozen world
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-slate leading-relaxed max-w-xl">
                Discover expedition reports, datasets, and stories from Antarctica,
                the Arctic, and the Himalaya. Synthesized for researchers,
                surveyors, and open polar inquiry.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-deep-teal hover:bg-[#12565A] active:bg-[#0D4144] text-white text-sm font-medium transition-all shadow-sm"
                >
                  <span>Explore the library</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#regions"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-paper-white hover:bg-[#F2F4F5] text-expedition-ink text-sm font-medium transition-colors hairline-border shadow-sm"
                >
                  <Compass className="w-4 h-4 text-slate" />
                  <span>Browse Atlas by Region</span>
                </a>
              </div>

              {/* Quick Metrics Bar */}
              <div className="pt-4 grid grid-cols-3 gap-4 w-full max-w-lg">
                <div className="bg-[#F2F4F5] p-3 rounded-md hairline-border">
                  <span className="block font-mono text-[10px] text-slate uppercase">
                    Published Resources
                  </span>
                  <span className="font-mono text-lg font-bold text-expedition-ink">
                    {records.length}
                  </span>
                </div>
                <div className="bg-[#F2F4F5] p-3 rounded-md hairline-border">
                  <span className="block font-mono text-[10px] text-slate uppercase">
                    Regions Covered
                  </span>
                  <span className="font-mono text-lg font-bold text-expedition-ink">
                    3
                  </span>
                </div>
                <div className="bg-[#F2F4F5] p-3 rounded-md hairline-border">
                  <span className="block font-mono text-[10px] text-slate uppercase">
                    Supplied DOIs
                  </span>
                  <span className="font-mono text-lg font-bold text-expedition-ink">
                    {records.filter(r => r.doi).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Photographic Plinth */}
            <div className="lg:col-span-6 relative">
              <div className="bg-paper-white rounded-xl p-3 hairline-border polar-card-shadow">
                {/* Archival Metadata Header */}
                <div className="flex items-center justify-between pb-2 mb-2 hairline-b text-slate font-mono text-xs">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-deep-teal" />
                    <span>LAT: 69°24′S · LON: 76°11′E · ELEV: 114m</span>
                  </span>
                  <span className="bg-[#ECEEEF] px-2 py-0.5 rounded text-expedition-ink font-semibold text-[10px]">
                    TRANSECT #04
                  </span>
                </div>

                {/* Scientific Image Frame */}
                <div className="relative overflow-hidden rounded-md aspect-[16/10] bg-[#ECEEEF]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoNm-_nXf3kb3RH5q4PamyLaBjdev8yfQUgx6U26FGuiuxCQO-Rs8R0i5wMzYTCo4ffWfpw8YFwyFz6OfgT-heHbORuBNmbraIqqWf1JsTnBaM5NLE7-YtwtT3BVe5lhm2vwhQHL7fcKT2vf-H8jvLt05RTgMvdK2_87cC_j5I_fwboLh1k-nB4bEQp-oZngYIaeKTjH8xwuA3v5ejN8MXhXFk711YfnSoUolGfMT5KPmCVDjUHFUX"
                    alt="Three polar scientists in vibrant orange and black high-visibility parkas working on a snowy ridge in Antarctica with sonic anemometer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 bg-expedition-ink/85 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-mono">
                    SERIES: XXXIX-INDAE-MET
                  </div>
                </div>

                {/* Curatorial Caption */}
                <div className="pt-3 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-deep-teal shrink-0 mt-0.5" />
                  <p className="text-xs text-slate leading-relaxed">
                    <strong className="text-expedition-ink font-medium">
                      Field observation team
                    </strong>{" "}
                    verifying sonic anemometer sensors at Larsemann Hills
                    transect · Indian Antarctic Expedition XXXIX · Demonstration
                    Record.
                  </p>
                </div>
              </div>

              {/* Offset Decorative Geodetic Tooltip */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-paper-white p-3 rounded-lg hairline-border polar-card-shadow items-center gap-3 z-10">
                <span className="w-8 h-8 rounded-full bg-[#EBF2F5] flex items-center justify-center text-deep-teal">
                  <Activity className="w-4 h-4" />
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-slate uppercase">
                    GROUND STATION
                  </span>
                  <span className="font-mono text-xs font-semibold text-expedition-ink">
                    Bharati Station / Coastal Polar Low
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Published Resource Index Archive Search & Dynamic Filters */}
      <section className="w-full bg-[#F2F4F5] py-12 hairline-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="w-full text-center space-y-1 mb-6">
            <span className="font-mono text-xs text-deep-teal uppercase tracking-widest font-semibold">
              Published Resource Index
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-expedition-ink">
              Query Cryospheric Databases
            </h2>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full relative shadow-sm rounded-xl bg-paper-white hairline-border">
            <div className="flex items-center px-4 py-3 gap-3">
              <Search className="w-5 h-5 text-deep-teal shrink-0" />
              <input
                id="archive-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by station, expedition, glaciology, ice core, permafrost..."
                className="w-full bg-transparent text-sm sm:text-base text-expedition-ink placeholder:text-[#8D9EA8] focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden md:inline-flex items-center px-2 py-1 rounded bg-[#ECEEEF] font-mono text-[11px] text-slate hairline-border">
                  ⌘K
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-deep-teal hover:bg-[#12565A] text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick Topic Chips */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono text-[11px] text-slate mr-1">
              QUICK CHIPS:
            </span>
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 rounded-full bg-paper-white hover:bg-deep-teal hover:text-white text-slate text-xs transition-colors hairline-border shadow-sm font-medium"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Explore by Region (The Three Poles) */}
      <section className="w-full bg-archive-white py-16" id="regions">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <span className="font-mono text-xs text-deep-teal uppercase tracking-widest font-semibold">
                Territorial Archival Sectors
              </span>
              <h2 className="text-3xl font-semibold text-expedition-ink">
                The Three Poles
              </h2>
            </div>
            <p className="text-sm text-slate max-w-md">
              Structured repositories aligned with global polar treaty protocols
              and regional alpine cryo-observatories.
            </p>
          </div>

          {/* Asymmetrical Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Region 1: Antarctica (Large Primary Block, 7 Cols) */}
            <div className="lg:col-span-7 bg-paper-white rounded-xl p-6 sm:p-8 hairline-border polar-card-shadow flex flex-col justify-between group hover:border-deep-teal transition-colors">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 hairline-b">
                  <span className="font-mono text-xs text-deep-teal font-semibold tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-deep-teal" />
                    SECTOR 01 // SOUTHERN OCEAN & ICE PLINTH
                  </span>
                  <span className="font-mono text-xs text-slate">
                    70°45′S 11°44′E
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors">
                    Antarctica Continental Archive
                  </h3>
                  <p className="text-sm text-slate leading-relaxed max-w-xl">
                    Permanent year-round stations{" "}
                    <strong className="text-expedition-ink font-semibold">
                      Maitri
                    </strong>{" "}
                    and{" "}
                    <strong className="text-expedition-ink font-semibold">
                      Bharati
                    </strong>
                    . Continuous katabatic wind recordings, deep permafrost drilling
                    in Schirmacher Oasis, and ice-shelf radar soundings across the
                    Princess Elizabeth Land margin.
                  </p>
                </div>

                {/* Detail Pills */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-md bg-[#F2F4F5] hairline-border">
                    <span className="block font-mono text-[10px] text-slate">
                      FIELD LOGS
                    </span>
                    <span className="font-mono text-sm font-bold text-expedition-ink">
                      142 Expeditions
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-[#F2F4F5] hairline-border">
                    <span className="block font-mono text-[10px] text-slate">
                      DATASETS
                    </span>
                    <span className="font-mono text-sm font-bold text-expedition-ink">
                      48 Open Repos
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-[#F2F4F5] hairline-border">
                    <span className="block font-mono text-[10px] text-slate">
                      SENSOR STATIONS
                    </span>
                    <span className="font-mono text-sm font-bold text-expedition-ink">
                      11 Automated
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 hairline-t flex items-center justify-between">
                <span className="text-xs text-slate font-mono">
                  Includes Ross Sea and Dronning Maud Land datasets
                </span>
                <Link
                  href="/library?region=Antarctica"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-deep-teal hover:underline"
                >
                  <span>Inspect Antarctic Sector</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Side Stack: Arctic + Himalaya (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Region 2: The Arctic */}
              <div className="bg-paper-white rounded-xl p-6 hairline-border polar-card-shadow flex flex-col justify-between group hover:border-deep-teal transition-colors flex-1">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 hairline-b">
                    <span className="font-mono text-[11px] text-deep-teal font-semibold tracking-wider">
                      SECTOR 02 // SVALBARD ARCHIPELAGO
                    </span>
                    <span className="font-mono text-[11px] text-slate">
                      78°55′N 11°56′E
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors">
                    The Arctic // Himadri Node
                  </h3>
                  <p className="mt-1 text-xs text-slate leading-relaxed">
                    Ny-Ålesund international research hub. Kongsfjorden fjord
                    dynamics, atmospheric chemistry, and marine snow monitoring
                    under high Arctic summer radiance.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#F2F4F5] text-slate font-mono text-[11px] hairline-border">
                      86 Field Bulletins
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#F2F4F5] text-slate font-mono text-[11px] hairline-border">
                      27 Hydrographic Traces
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 hairline-t flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate">
                    Kongsvegen Glacier Link
                  </span>
                  <Link
                    href="/library?region=Arctic"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-deep-teal hover:underline"
                  >
                    <span>View Arctic Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Region 3: Himalaya / Third Pole */}
              <div className="bg-paper-white rounded-xl p-6 hairline-border polar-card-shadow flex flex-col justify-between group hover:border-deep-teal transition-colors flex-1">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 hairline-b">
                    <span className="font-mono text-[11px] text-deep-teal font-semibold tracking-wider">
                      SECTOR 03 // HIGH MOUNTAIN ASIA
                    </span>
                    <span className="font-mono text-[11px] text-slate">
                      32°17′N 77°35′E
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors">
                    The Himalaya // Chandra Basin
                  </h3>
                  <p className="mt-1 text-xs text-slate leading-relaxed">
                    Chhota Shigri benchmark glacier, Spiti permafrost zones, and
                    high-altitude meteorological observatories measuring mass
                    balance and meltwater discharges.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#F2F4F5] text-slate font-mono text-[11px] hairline-border">
                      94 Glacial Surveys
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#F2F4F5] text-slate font-mono text-[11px] hairline-border">
                      34 Cryo-Layers
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 hairline-t flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate">
                    Himansh Field Base
                  </span>
                  <Link
                    href="/library?region=Himalaya"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-deep-teal hover:underline"
                  >
                    <span>View Himalayan Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Expedition Spotlight */}
      <section className="w-full bg-[#F2F4F5] py-16 hairline-y">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-paper-white rounded-xl overflow-hidden hairline-border polar-card-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left: Big Expedition Photo */}
              <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px] bg-[#ECEEEF]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4MjcudXDriqb4qdULafIpsEtsHD5ikAMpWN97_QzdD9uYWnLL7v7KA5qKbwtR0E2noF5QvtTJ0opqWkwfPd3t7ir8_Yll7wZ_7M17dwIVd_NyZWYPgg__f5wiLcEQHPts5ESIQZZfgFOd5nnD34D9i78kHvBoQ23atGxEFfgxk5v6hccuTRn0Zksk4kxS9TXSUStlvHdUDRM1SgJzwJZ7EA3kIL-nDQQ7jyQlWj4oiQBTzzjR1H8k"
                  alt="Himalayan glaciology team operating a portable motorized ice-core drill rig mounted on a tripod frame"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-expedition-ink/85 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono font-medium">
                  CHANDRA TRANSECT EXPEDITION 2023–24
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-paper-white/95 backdrop-blur-md p-3 rounded-lg hairline-border shadow-sm text-expedition-ink text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                  <span>Station Base: Himansh Observatory · Elevation 4,080m</span>
                  <span className="font-bold text-deep-teal">CORE DEPTH: 48.6m</span>
                </div>
              </div>

              {/* Right: Expedition Dossier */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-paper-white">
                <div className="space-y-4">
                  <div>
                    <span className="font-mono text-xs text-deep-teal uppercase tracking-widest font-semibold">
                      Special Focus Dossier
                    </span>
                    <h3 className="text-2xl font-bold text-expedition-ink mt-1">
                      Chandra Basin Cryospheric Transect
                    </h3>
                  </div>
                  <p className="text-sm text-slate leading-relaxed">
                    Documenting glacier thinning, debris-cover insulating gradients,
                    and seasonal snowmelt dynamics across Western Himalaya altitude
                    bands (4,200m – 5,400m).
                  </p>

                  {/* Linked Assets List */}
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-[10px] text-slate uppercase tracking-wider block font-semibold">
                      Linked Scientific Assets
                    </span>
                    <Link
                      href="/library?q=Chandra"
                      className="flex items-center justify-between p-3 rounded-md bg-[#F7F9FA] hover:bg-[#F2F4F5] transition-colors group hairline-border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-deep-teal" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors">
                            Field Notes from Chandra Basin
                          </span>
                          <span className="font-mono text-[10px] text-slate">
                            PDF · 38 pages · Field Logbook
                          </span>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate group-hover:text-deep-teal" />
                    </Link>

                    <Link
                      href="/library?q=Ablation"
                      className="flex items-center justify-between p-3 rounded-md bg-[#F7F9FA] hover:bg-[#F2F4F5] transition-colors group hairline-border"
                    >
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-slate" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors">
                            3 Open Datasets (.CSV / .NetCDF)
                          </span>
                          <span className="font-mono text-[10px] text-slate">
                            Ablation Stake Timeseries 2018–2023
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate group-hover:text-deep-teal" />
                    </Link>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 hairline-t flex items-center justify-between">
                  <span className="font-mono text-xs text-slate">
                    Illustrative story — no registered DOI
                  </span>
                  <Link
                    href="/library?q=Chandra"
                    className="px-4 py-2 rounded-md bg-[#ECEEEF] hover:bg-[#E1E3E4] text-expedition-ink text-xs font-semibold transition-colors"
                  >
                    View Full Dossier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Latest Curated Resources Feed */}
      <section className="w-full bg-archive-white py-16" id="library">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <span className="font-mono text-xs text-deep-teal uppercase tracking-widest font-semibold">
                Latest Curated Resources
              </span>
              <h2 className="text-3xl font-semibold text-expedition-ink">
                Recent Field Additions
              </h2>
            </div>
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["All", "Report", "Dataset", "Story", "Protocol"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedType === type
                      ? "bg-deep-teal text-white shadow-sm"
                      : "bg-paper-white text-slate hover:bg-[#ECEEEF] hairline-border"
                  }`}
                >
                  {type === "All" ? "All Types" : `${type}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Resource List Plinth */}
          <div className="bg-paper-white rounded-xl hairline-border polar-card-shadow divide-y divide-contour-grey overflow-hidden">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 hover:bg-[#F7F9FA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase mt-0.5 shrink-0 hairline-border ${
                      record.type === "Report"
                        ? "bg-[#EBF2F5] text-deep-teal"
                        : record.type === "Dataset"
                        ? "bg-[#D6E4F1] text-expedition-ink"
                        : record.type === "Story"
                        ? "bg-[#E1E3E4] text-slate"
                        : "bg-[#ECEEEF] text-expedition-ink"
                    }`}
                  >
                    {record.type}
                  </span>

                  <div className="space-y-1">
                    <Link
                      href={`/library?q=${encodeURIComponent(record.title)}`}
                      className="text-base font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors block"
                    >
                      {record.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate font-sans">
                      <span>{record.date}</span>
                      <span className="text-contour-grey">·</span>
                      <span>{record.station}</span>
                      <span className="text-contour-grey">·</span>
                      <span className="font-mono text-deep-teal">
                        DOI: {record.doi || "Not supplied"}
                      </span>
                      <span className="text-contour-grey">·</span>
                      <span className="text-cryo-forest font-medium">
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="font-mono text-xs text-slate hidden lg:inline">
                    {record.fileFormat} · {record.fileSize}
                  </span>
                  <Link
                    href={`/library?q=${encodeURIComponent(record.title)}`}
                    className="p-2 rounded-md hover:bg-[#ECEEEF] text-deep-teal transition-colors"
                    title="View record"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Browse all button */}
          <div className="flex items-center justify-center pt-2">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-paper-white hover:bg-[#F2F4F5] text-expedition-ink text-sm font-semibold transition-colors hairline-border shadow-sm"
            >
              <span>Search and browse all {records.length} records</span>
              <Layers className="w-4 h-4 text-slate" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Portal Mission Statement Banner */}
      <section className="w-full bg-[#F2F4F5] py-12 hairline-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-paper-white rounded-xl p-6 sm:p-8 hairline-border polar-card-shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 font-mono text-xs text-deep-teal font-semibold uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Open Science Protocol</span>
                </div>
                <p className="text-sm sm:text-base text-expedition-ink leading-relaxed">
                  Dhruv Atlas is an open scientific outreach and archival
                  platform built by <strong>g-SAP</strong> to synthesize knowledge
                  across India&apos;s polar and high-altitude research endeavours.
                  Published content remains subject to its source permissions.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                <span className="font-mono text-[10px] text-slate uppercase">
                  METADATA SCHEME
                </span>
                <span className="px-3 py-1 rounded bg-[#F7F9FA] font-mono text-xs font-semibold text-expedition-ink hairline-border">
                  Illustrative metadata
                </span>
                <Link
                  href="/about"
                  className="text-xs text-deep-teal hover:underline font-medium mt-1 flex items-center gap-1"
                >
                  <span>Read Archival Charter</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Cartographic Coordinates Inspector Bar */}
      <section className="w-full bg-archive-white py-4 hairline-b">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-expedition-ink font-semibold">
                PRIMARY DATUM: WGS 84
              </span>
              <span>POLAR STEREOGRAPHIC (EPSG:3031)</span>
              <span>ARCTIC STEREOGRAPHIC (EPSG:3995)</span>
            </div>
            <div className="flex items-center gap-4 text-slate">
              <span>ACCURACY: ±0.0001°</span>
              <span className="text-deep-teal font-bold">DHRUV CORE NODE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

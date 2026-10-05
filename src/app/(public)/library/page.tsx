"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useResources } from "@/lib/use-resources";
import { PolarRecord } from "@/lib/mockData";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Download,
  ExternalLink,
  MapPin,
  FileText,
  Database,
  ScrollText,
  FileCode,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Sparkles,
  RotateCcw,
  ArrowUpDown,
  LayoutGrid,
  List,
  Compass,
  Layers,
  ChevronRight,
  BookOpen,
} from "lucide-react";

function KnowledgeLibraryContent() {
  const { records, notice } = useResources();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialQuery = searchParams.get("q") || "";
  const initialRegion = searchParams.get("region") || "All";
  const initialType = searchParams.get("type") || "All";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedStation, setSelectedStation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "region">("recent");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL search params change
  useEffect(() => {
    if (searchParams.get("q") !== null) {
      setSearchQuery(searchParams.get("q") || "");
    }
    if (searchParams.get("region")) {
      setSelectedRegion(searchParams.get("region") || "All");
    }
    if (searchParams.get("type")) {
      setSelectedType(searchParams.get("type") || "All");
    }
  }, [searchParams]);

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          rec.title.toLowerCase().includes(q) ||
          rec.abstract.toLowerCase().includes(q) ||
          rec.station.toLowerCase().includes(q) ||
          rec.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          rec.doi.toLowerCase().includes(q) ||
          rec.authors.some((author) => author.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Region match
      if (selectedRegion !== "All" && rec.region !== selectedRegion) {
        return false;
      }

      // Type match
      if (selectedType !== "All" && rec.type !== selectedType) {
        return false;
      }

      // Station match
      if (selectedStation !== "All" && rec.station !== selectedStation) {
        return false;
      }

      // Status match
      if (selectedStatus !== "All" && rec.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "region") return a.region.localeCompare(b.region);
      return b.date.localeCompare(a.date);
    });
  }, [
    records, searchQuery,
    selectedRegion,
    selectedType,
    selectedStation,
    selectedStatus,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedRegion !== "All" ||
    selectedType !== "All" ||
    selectedStation !== "All" ||
    selectedStatus !== "All";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedRegion("All");
    setSelectedType("All");
    setSelectedStation("All");
    setSelectedStatus("All");
    router.push("/library");
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "Report":
        return <FileText className="w-4 h-4 text-deep-teal" />;
      case "Dataset":
        return <Database className="w-4 h-4 text-deep-teal" />;
      case "Story":
        return <ScrollText className="w-4 h-4 text-slate" />;
      case "Protocol":
        return <FileCode className="w-4 h-4 text-deep-teal" />;
      case "Media":
        return <ImageIcon className="w-4 h-4 text-slate" />;
      default:
        return <FileText className="w-4 h-4 text-deep-teal" />;
    }
  };

  return (
    <div className="w-full bg-archive-white min-h-[calc(100vh-16rem)]">
      {/* Top Breadcrumb & Library Banner */}
      <section className="bg-paper-white hairline-b py-8">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-slate">
                <Link href="/" className="hover:text-deep-teal transition-colors">
                  DHRUV ATLAS
                </Link>
                <span>/</span>
                <span className="text-expedition-ink font-semibold">
                  KNOWLEDGE LIBRARY
                </span>
              </div>
              {notice && <p role="status" className="p-3 my-3 border rounded text-slate">{notice}</p>}
          <h1 className="text-3xl sm:text-4xl font-semibold text-expedition-ink">
                Polar Scientific Index
              </h1>
              <p className="text-sm text-slate max-w-2xl">
                Search reports, datasets, images, and videos published by portal administrators.
              </p>
            </div>

            {/* Live active stats */}
            <div className="flex items-center gap-3 font-mono text-xs text-slate">
              <div className="px-3 py-1.5 rounded-md bg-[#F7F9FA] hairline-border">
                <span className="text-slate">CATALOG: </span>
                <strong className="text-expedition-ink font-bold">{records.length}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-md bg-[#F7F9FA] hairline-border">
                <span className="text-slate">STATUS: </span>
                <strong className="text-cryo-forest font-bold">PUBLISHED ONLY</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Library Layout Container */}
      <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden col-span-1 flex items-center justify-between">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-paper-white hairline-border rounded-md text-xs font-semibold text-expedition-ink"
            >
              <Filter className="w-4 h-4 text-deep-teal" />
              <span>{mobileFilterOpen ? "Hide Filters" : "Filter Records"}</span>
            </button>
            <span className="text-xs font-mono text-slate">
              {filteredRecords.length} records found
            </span>
          </div>

          {/* Left Column: Filter Sidebar (4 cols on lg) */}
          <aside
            className={`lg:col-span-4 bg-paper-white rounded-xl p-5 hairline-border polar-card-shadow space-y-6 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between pb-3 hairline-b">
              <span className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-expedition-ink">
                <SlidersHorizontal className="w-4 h-4 text-deep-teal" />
                <span>Search Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 text-[11px] font-mono text-deep-teal hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Keyword Search Input */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] font-semibold text-slate uppercase">
                Search Terms
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keywords, DOIs, authors..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border focus:outline-none focus:border-deep-teal text-expedition-ink"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate hover:text-expedition-ink"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Geographical Region */}
            <div className="space-y-2">
              <label className="block font-mono text-[11px] font-semibold text-slate uppercase">
                Geographic Pole / Region
              </label>
              <div className="space-y-1">
                {[
                  { id: "All", label: "All Regions" },
                  { id: "Antarctica", label: "Antarctica Continental" },
                  { id: "Arctic", label: "The Arctic (Svalbard)" },
                  { id: "Himalaya", label: "Himalaya (Third Pole)" },
                  { id: "Southern Ocean", label: "Southern Ocean Transect" },
                ].map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedRegion === region.id
                        ? "bg-deep-teal text-white font-medium shadow-sm"
                        : "text-slate hover:bg-[#F2F4F5] hover:text-expedition-ink"
                    }`}
                  >
                    <span>{region.label}</span>
                    {selectedRegion === region.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Resource Type */}
            <div className="space-y-2">
              <label className="block font-mono text-[11px] font-semibold text-slate uppercase">
                Resource Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {["All", "Report", "Dataset", "Story", "Protocol", "Media"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-center transition-colors hairline-border ${
                        selectedType === type
                          ? "bg-deep-teal text-white border-deep-teal shadow-sm"
                          : "bg-[#F7F9FA] text-slate hover:bg-[#ECEEEF] hover:text-expedition-ink"
                      }`}
                    >
                      {type === "All" ? "All Types" : type}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Research Station */}
            <div className="space-y-2">
              <label className="block font-mono text-[11px] font-semibold text-slate uppercase">
                Observatory & Station
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
              >
                <option value="All">All Research Stations</option>
                <option value="Maitri Station">Maitri Station (Antarctica)</option>
                <option value="Bharati Station">Bharati Station (Antarctica)</option>
                <option value="Himadri Station">Himadri Station (Arctic)</option>
                <option value="Himansh Field Base">Himansh Base (Himalaya)</option>
                <option value="ORV Sagar Nidhi">ORV Sagar Nidhi (Ship)</option>
              </select>
            </div>

            {/* Validation Tier */}
            <div className="space-y-2">
              <label className="block font-mono text-[11px] font-semibold text-slate uppercase">
                Publication status
              </label>
              <div className="space-y-1">
                {[
                  { id: "All", label: "All Statuses" },
                  { id: "Published", label: "Published by an editor" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatus(st.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedStatus === st.id
                        ? "bg-[#EBF2F5] text-deep-teal font-medium hairline-border"
                        : "text-slate hover:bg-[#F2F4F5] hover:text-expedition-ink"
                    }`}
                  >
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column: Search Results & Controls (8 cols on lg) */}
          <main className="lg:col-span-8 space-y-6">
            {/* Results Header Bar */}
            <div className="bg-paper-white rounded-xl p-4 hairline-border polar-card-shadow flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-expedition-ink">
                  {filteredRecords.length}
                </span>
                <span className="text-xs text-slate">
                  {filteredRecords.length === 1 ? "record found" : "records found"}
                </span>
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded bg-[#EBF2F5] text-deep-teal font-mono text-xs hairline-border">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              {/* Sort & View Mode Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate" />
                  <span className="hidden sm:inline font-mono">SORT:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "recent" | "title" | "region")
                    }
                    className="bg-[#F7F9FA] px-2 py-1 rounded text-xs text-expedition-ink hairline-border focus:outline-none"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="region">Pole / Region</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center p-0.5 bg-[#F2F4F5] rounded-md hairline-border">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-1.5 rounded ${
                      viewMode === "cards"
                        ? "bg-white text-deep-teal shadow-sm"
                        : "text-slate hover:text-expedition-ink"
                    }`}
                    title="Card View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded ${
                      viewMode === "table"
                        ? "bg-white text-deep-teal shadow-sm"
                        : "text-slate hover:text-expedition-ink"
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid / List */}
            {filteredRecords.length > 0 ? (
              viewMode === "cards" ? (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <article
                      key={record.id}
                      className="bg-paper-white rounded-xl p-5 sm:p-6 hairline-border polar-card-shadow hover:border-deep-teal transition-all group"
                    >
                      {/* Upper Metadata Band */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 hairline-b text-xs font-mono text-slate">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-deep-teal uppercase">
                            {record.region.toUpperCase()} // {record.station.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate">{record.date}</span>
                          <span className="text-contour-grey">·</span>
                          <span className="text-deep-teal font-medium">
                            DOI: {record.doi || "Not supplied"}
                          </span>
                        </div>
                      </div>

                      {/* Title & Abstract */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-1">{getRecordIcon(record.type)}</span>
                          <h2 className="text-lg font-bold text-expedition-ink group-hover:text-deep-teal transition-colors">
                            <Link href={"/resources/" + record.id}>{record.title}</Link>
                          </h2>
                        </div>

                        <p className="text-xs sm:text-sm text-slate leading-relaxed pl-6">
                          {record.abstract}
                        </p>
                      </div>

                      {/* Tag Chips & Coordinates */}
                      <div className="mt-4 pt-3 hairline-t flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate px-2 py-0.5 rounded bg-[#F7F9FA] hairline-border">
                            <MapPin className="w-3 h-3 text-deep-teal" />
                            <span>⌖ {record.coordinates}</span>
                            {record.elevation && <span>· {record.elevation}</span>}
                          </span>

                          {record.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSearchQuery(tag)}
                              className="px-2 py-0.5 rounded-full bg-[#EBF2F5] hover:bg-deep-teal hover:text-white text-slate text-[11px] font-medium transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate mr-2 hidden sm:inline">
                            {record.fileFormat} · {record.fileSize}
                          </span>
                          <button
                            onClick={() =>
                              window.location.assign(record.downloadUrl || "/library")
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#ECEEEF] hover:bg-deep-teal hover:text-white text-expedition-ink text-xs font-semibold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* Compact Table View */
                <div className="bg-paper-white rounded-xl hairline-border polar-card-shadow overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F9FA] hairline-b font-mono text-[11px] text-slate uppercase">
                      <tr>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Title & DOI</th>
                        <th className="p-3.5">Region / Station</th>
                        <th className="p-3.5">Format</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-contour-grey">
                      {filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-[#F7F9FA] transition-colors"
                        >
                          <td className="p-3.5 font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#EBF2F5] text-deep-teal font-semibold text-[10px]">
                              {record.type}
                            </span>
                          </td>
                          <td className="p-3.5 max-w-sm">
                            <div className="font-semibold text-expedition-ink truncate">
                              {record.title}
                            </div>
                            <div className="font-mono text-[10px] text-slate">
                              {record.doi}
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate">
                            <div>{record.region}</div>
                            <div className="text-[10px] text-slate">
                              {record.station}
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate">
                            {record.fileFormat} · {record.fileSize}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() =>
                                window.location.assign(record.downloadUrl || "/library")
                              }
                              className="p-1.5 rounded hover:bg-[#ECEEEF] text-deep-teal"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              /* P04a Empty Search State (matching Stitch exactly) */
              <div className="bg-paper-white rounded-xl p-8 sm:p-12 hairline-border polar-card-shadow text-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-[#EBF2F5] flex items-center justify-center text-deep-teal mx-auto">
                  <Search className="w-7 h-7" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-expedition-ink">
                    No Archived Records Found
                  </h3>
                  <p className="text-xs sm:text-sm text-slate leading-relaxed">
                    We couldn&apos;t find any archived publications, datasets, or
                    field notes matching the selected parameters.
                  </p>
                </div>

                {/* Helpful Search Guidance Card */}
                <div className="max-w-lg mx-auto bg-[#F7F9FA] rounded-lg p-5 text-left text-xs text-slate space-y-2 hairline-border">
                  <span className="font-mono font-semibold text-deep-teal uppercase block">
                    Curatorial Search Recommendations:
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Check for spelling errors or technical acronym variations
                      (e.g., RES vs Radio Echo Sounding).
                    </li>
                    <li>
                      Try broader topic tags (e.g., search &apos;Sub-ice
                      Glaciology&apos; rather than specific borehole
                      identifiers).
                    </li>
                    <li>
                      Remove date or station constraints to expand beyond specific
                      field campaigns.
                    </li>
                  </ul>
                </div>

                {/* Reset Action */}
                <div className="pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-deep-teal hover:bg-[#12565A] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Browse All {records.length} Records</span>
                  </button>
                </div>

                {/* Quick Discovery Pathways */}
                <div className="pt-6 hairline-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <Link
                    href="/explore"
                    className="p-4 rounded-lg bg-[#F7F9FA] hover:bg-[#F2F4F5] transition-colors hairline-border group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-expedition-ink group-hover:text-deep-teal">
                        Explore Geo-Atlas
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate group-hover:text-deep-teal" />
                    </div>
                    <p className="text-[11px] text-slate mt-1">
                      Inspect spatial layers on the interactive polar stereographic projection map.
                    </p>
                  </Link>

                  <Link
                    href="/media"
                    className="p-4 rounded-lg bg-[#F7F9FA] hover:bg-[#F2F4F5] transition-colors hairline-border group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-expedition-ink group-hover:text-deep-teal">
                        Cartographic Plates
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate group-hover:text-deep-teal" />
                    </div>
                    <p className="text-[11px] text-slate mt-1">
                      High-resolution bathymetric surveys, historical field plates, and radar echograms.
                    </p>
                  </Link>

                  <Link
                    href="/stories"
                    className="p-4 rounded-lg bg-[#F7F9FA] hover:bg-[#F2F4F5] transition-colors hairline-border group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-expedition-ink group-hover:text-deep-teal">
                        Expedition Logs
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate group-hover:text-deep-teal" />
                    </div>
                    <p className="text-[11px] text-slate mt-1">
                      First-hand narratives from station over-wintering teams and traverse scientists.
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeLibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-mono text-sm text-slate">
          Loading Polar Knowledge Index...
        </div>
      }
    >
      <KnowledgeLibraryContent />
    </Suspense>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { REGIONS_META, POLAR_RECORDS, TELEMETRY_FEED } from "@/lib/mockData";
import {
  Compass,
  MapPin,
  Layers,
  ArrowRight,
  Maximize2,
  Activity,
  Sliders,
  Radio,
  ExternalLink,
} from "lucide-react";

export default function ExploreAtlasPage() {
  const [activePole, setActivePole] = useState<"antarctica" | "arctic" | "himalaya">("antarctica");
  const selectedRegion = REGIONS_META.find((r) => r.id === activePole) || REGIONS_META[0];

  return (
    <div className="w-full bg-archive-white min-h-[calc(100vh-16rem)]">
      {/* Header */}
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
                  EXPLORE GEO-ATLAS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-expedition-ink">
                Polar Cartographic Viewport
              </h1>
              <p className="text-sm text-slate max-w-2xl">
                Geodetic projection viewer, automated sensor waypoints, and spatial transects across the cryospheric realm.
              </p>
            </div>

            {/* Projection Mode Pills */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded bg-[#EBF2F5] text-deep-teal font-semibold hairline-border">
                EPSG:3031 (POLAR STEREO)
              </span>
              <span className="px-3 py-1.5 rounded bg-white text-slate hairline-border">
                WGS 84 DATUM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Viewport Container */}
      <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Pole Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-paper-white rounded-lg hairline-border max-w-md">
          <button
            onClick={() => setActivePole("antarctica")}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
              activePole === "antarctica"
                ? "bg-deep-teal text-white shadow-sm"
                : "text-slate hover:text-expedition-ink"
            }`}
          >
            Antarctica
          </button>
          <button
            onClick={() => setActivePole("arctic")}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
              activePole === "arctic"
                ? "bg-deep-teal text-white shadow-sm"
                : "text-slate hover:text-expedition-ink"
            }`}
          >
            The Arctic
          </button>
          <button
            onClick={() => setActivePole("himalaya")}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
              activePole === "himalaya"
                ? "bg-deep-teal text-white shadow-sm"
                : "text-slate hover:text-expedition-ink"
            }`}
          >
            The Himalaya
          </button>
        </div>

        {/* Interactive Cartographic Canvas Mockup */}
        <div className="bg-paper-white rounded-xl overflow-hidden hairline-border polar-card-shadow">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#17242D] overflow-hidden">
            {/* Background Satellite Map image */}
            <img
              src={selectedRegion.image}
              alt={selectedRegion.name}
              className="w-full h-full object-cover opacity-80"
            />

            {/* Cartographic Coordinate Overlay Grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-expedition-ink/90 via-transparent to-expedition-ink/40" />

            {/* Top HUD Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
              <div className="flex items-center gap-2 bg-expedition-ink/80 backdrop-blur-md px-3 py-1.5 rounded hairline-border">
                <Compass className="w-4 h-4 text-deep-teal animate-spin" />
                <span>{selectedRegion.sector}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 bg-expedition-ink/80 backdrop-blur-md px-3 py-1.5 rounded hairline-border">
                <span>COORD: {selectedRegion.coordinates}</span>
              </div>
            </div>

            {/* Station Waypoints Pin */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-deep-teal border-2 border-white flex items-center justify-center animate-ping" />
              <div className="relative -top-5 w-4 h-4 rounded-full bg-deep-teal border-2 border-white" />
              <div className="bg-paper-white/95 backdrop-blur-md px-2.5 py-1 rounded text-expedition-ink font-mono text-[10px] font-bold shadow-md -mt-2">
                {selectedRegion.stations[0]}
              </div>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-paper-white/90 backdrop-blur-md p-4 rounded-lg hairline-border shadow-md flex flex-wrap items-center justify-between gap-4 text-expedition-ink">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-slate uppercase">
                  ACTIVE OBSERVATORY SECTOR
                </span>
                <h3 className="font-bold text-sm sm:text-base">
                  {selectedRegion.name}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate">
                <span>{selectedRegion.fieldLogsCount} Field Logs</span>
                <span>·</span>
                <span>{selectedRegion.datasetsCount} Open Datasets</span>
                <span>·</span>
                <span>{selectedRegion.sensorsCount} Sample Sensors</span>
              </div>

              <Link
                href={`/library?region=${encodeURIComponent(
                  activePole === "antarctica"
                    ? "Antarctica"
                    : activePole === "arctic"
                    ? "Arctic"
                    : "Himalaya"
                )}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-deep-teal hover:bg-[#12565A] text-white text-xs font-semibold transition-colors"
              >
                <span>Filter Knowledge Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Station Dossier for Selected Region */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-paper-white p-5 rounded-xl hairline-border polar-card-shadow space-y-2">
            <span className="font-mono text-[11px] text-deep-teal font-semibold uppercase">
              Permanent Field Bases
            </span>
            <p className="text-sm font-semibold text-expedition-ink">
              {selectedRegion.stations.join(" & ")}
            </p>
            <p className="text-xs text-slate leading-relaxed">
              {selectedRegion.description}
            </p>
          </div>

          <div className="bg-paper-white p-5 rounded-xl hairline-border polar-card-shadow space-y-2">
            <span className="font-mono text-[11px] text-deep-teal font-semibold uppercase">
              Geodetic Coordinates
            </span>
            <p className="text-sm font-mono font-semibold text-expedition-ink">
              {selectedRegion.coordinates}
            </p>
            <p className="text-xs text-slate leading-relaxed">
              Illustrative station locations; not a verified survey or navigational map.
            </p>
          </div>

          <div className="bg-paper-white p-5 rounded-xl hairline-border polar-card-shadow space-y-2">
            <span className="font-mono text-[11px] text-deep-teal font-semibold uppercase">
              Archival Protocol
            </span>
            <p className="text-sm font-semibold text-expedition-ink">
              Illustrative station display — no live data integration
            </p>
            <p className="text-xs text-slate leading-relaxed">
              {selectedRegion.tag}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

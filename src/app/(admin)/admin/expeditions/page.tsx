"use client";

import React from "react";
import Link from "next/link";
import { TELEMETRY_FEED, REGIONS_META } from "@/lib/mockData";
import { Compass, MapPin, Radio, Activity, ExternalLink } from "lucide-react";

export default function AdminExpeditionsPage() {
  const expeditions = [
    {
      id: "exp-01",
      title: "43rd Indian Scientific Expedition to Antarctica (XLIII-ISEA)",
      dates: "Nov 2023 – Apr 2024",
      station: "Maitri & Bharati Stations",
      teamSize: "48 Scientists & Engineers",
      status: "Operational / Wintering Over",
      focus: "Katabatic wind boundary layer, subglacial sediment coring, and magnetospheric wave propagation.",
    },
    {
      id: "exp-02",
      title: "Indian Arctic Expedition 2024 (Summer Phase)",
      dates: "Jun 2024 – Sep 2024",
      station: "Himadri Station, Ny-Ålesund, Svalbard",
      teamSize: "18 Researchers",
      status: "Completed / Data Archiving",
      focus: "Kongsfjorden water column hydrography, marine snow biogeochemistry, and fjord microplastics.",
    },
    {
      id: "exp-03",
      title: "Western Himalaya Cryosphere Transect 2023–24",
      dates: "Continuous Monitoring",
      station: "Himansh Observatory, Spiti Valley",
      teamSize: "12 Glaciologists",
      status: "Active Field Operations",
      focus: "Chhota Shigri benchmark glacier mass balance, ablation stake timeseries, and permafrost temperatures.",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="font-mono text-xs text-deep-teal uppercase tracking-widest font-semibold">
            Field Operations
          </span>
          <p className="p-3 border rounded">Sample station and expedition display. No live readings are connected.</p><h1 className="text-2xl sm:text-3xl font-bold text-expedition-ink mt-1">
            Expeditions & Observatories
          </h1>
          <p className="text-xs sm:text-sm text-slate">
            Track active polar field campaigns, research bases, and continuous automated observation nodes.
          </p>
        </div>
      </div>

      {/* Observatories Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {TELEMETRY_FEED.map((st) => (
          <div
            key={st.station}
            className="bg-paper-white p-5 rounded-xl hairline-border polar-card-shadow space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-expedition-ink">
                {st.station}
              </span>
              <span className="w-2 h-2 rounded-full bg-cryo-forest" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-mono text-slate">{st.region}</p>
              <p className="text-[11px] font-mono text-deep-teal">{st.coordinates}</p>
            </div>
            <div className="pt-2 hairline-t flex items-center justify-between text-xs font-mono text-expedition-ink">
              <span>{st.temp}</span>
              <span>{st.wind}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Expeditions List */}
      <div className="bg-paper-white rounded-xl hairline-border polar-card-shadow overflow-hidden">
        <div className="p-5 hairline-b flex items-center justify-between">
          <h2 className="text-base font-bold text-expedition-ink">
            Registered Scientific Expeditions
          </h2>
          <span className="text-xs font-mono text-slate">
            {expeditions.length} field campaigns
          </span>
        </div>

        <div className="divide-y divide-contour-grey">
          {expeditions.map((exp) => (
            <div key={exp.id} className="p-6 hover:bg-[#F7F9FA] transition-colors space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-[#EBF2F5] text-deep-teal font-mono text-xs font-semibold">
                  {exp.status}
                </span>
                <span className="font-mono text-xs text-slate">{exp.dates}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-expedition-ink">
                  {exp.title}
                </h3>
                <p className="text-xs text-slate mt-1">{exp.focus}</p>
              </div>
              <div className="pt-2 hairline-t flex items-center justify-between text-xs font-mono text-slate">
                <span>Base: {exp.station}</span>
                <span>Crew: {exp.teamSize}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

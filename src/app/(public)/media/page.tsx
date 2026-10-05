"use client";

import React, { useState } from "react";
import Link from "next/link";
import { POLAR_RECORDS } from "@/lib/mockData";
import { Image as ImageIcon, Download, ExternalLink, MapPin, Eye } from "lucide-react";

export default function MediaArchivePage() {
  const mediaItems = [
    {
      id: "med-01",
      title: "Larsemann Hills Coastal Drone Orthomosaic Plate",
      region: "Antarctica",
      station: "Bharati Station",
      format: "GeoTIFF / JPG",
      resolution: "5 cm/pixel",
      date: "Mar 2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoNm-_nXf3kb3RH5q4PamyLaBjdev8yfQUgx6U26FGuiuxCQO-Rs8R0i5wMzYTCo4ffWfpw8YFwyFz6OfgT-heHbORuBNmbraIqqWf1JsTnBaM5NLE7-YtwtT3BVe5lhm2vwhQHL7fcKT2vf-H8jvLt05RTgMvdK2_87cC_j5I_fwboLh1k-nB4bEQp-oZngYIaeKTjH8xwuA3v5ejN8MXhXFk711YfnSoUolGfMT5KPmCVDjUHFUX",
    },
    {
      id: "med-02",
      title: "Chandra Basin Motorized Ice Core Rig Operations",
      region: "Himalaya",
      station: "Himansh Observatory",
      format: "4K RAW / ProRes",
      resolution: "3840 x 2160",
      date: "Feb 2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4MjcudXDriqb4qdULafIpsEtsHD5ikAMpWN97_QzdD9uYWnLL7v7KA5qKbwtR0E2noF5QvtTJ0opqWkwfPd3t7ir8_Yll7wZ_7M17dwIVd_NyZWYPgg__f5wiLcEQHPts5ESIQZZfgFOd5nnD34D9i78kHvBoQ23atGxEFfgxk5v6hccuTRn0Zksk4kxS9TXSUStlvHdUDRM1SgJzwJZ7EA3kIL-nDQQ7jyQlWj4oiQBTzzjR1H8k",
    },
    {
      id: "med-03",
      title: "Kongsfjorden Fjord Iceberg Front Stratigraphy",
      region: "Arctic",
      station: "Himadri Station (Ny-Ålesund)",
      format: "High-Res Plate",
      resolution: "6000 x 4000",
      date: "Aug 2024",
      image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div className="w-full bg-archive-white min-h-[calc(100vh-16rem)]">
      {/* Header */}
      <section className="bg-paper-white hairline-b py-8">
        <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-mono text-xs text-slate">
            <Link href="/" className="hover:text-deep-teal transition-colors">
              DHRUV ATLAS
            </Link>
            <span>/</span>
            <span className="text-expedition-ink font-semibold">
              FIELD MEDIA ARCHIVE
            </span>
          </div>
          <p className="text-sm text-slate">Illustrative gallery. Images are not verified expedition records. Publish real images through the Knowledge Library.</p><h1 className="text-3xl sm:text-4xl font-semibold text-expedition-ink mt-1">
            Cartographic & Expedition Media
          </h1>
          <p className="text-sm text-slate max-w-2xl mt-1">
            Curated photographic plates, drone orthomosaics, radar echograms, and field documentation records.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-atlas mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-paper-white rounded-xl overflow-hidden hairline-border polar-card-shadow group"
            >
              <div className="relative aspect-[16/10] bg-[#ECEEEF] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-expedition-ink/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  {item.region.toUpperCase()}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate">
                  <span>{item.station}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-expedition-ink group-hover:text-deep-teal transition-colors">
                  {item.title}
                </h3>
                <div className="pt-2 hairline-t flex items-center justify-between text-xs font-mono text-slate">
                  <span>{item.format}</span>
                  <button
                    disabled title="Illustrative image: no downloadable research file"
                    className="p-1.5 rounded hover:bg-[#ECEEEF] text-deep-teal transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  Share2,
} from "lucide-react";
import type { AiSummaryResponse } from "@/app/api/generate-summary/route";

export default function AdminUploadPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generateAiDraft, setGenerateAiDraft] = useState(false);
  const [aiDraftResult, setAiDraftResult] = useState<AiSummaryResponse | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    region: "Antarctica",
    station: "Bharati Station",
    type: "report",
    doi: "",
    abstract: "",
    tags: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Prepare FormData for /api/upload
      const uploadBody = new FormData();
      if (selectedFile) {
        uploadBody.append("file", selectedFile);
      }
      uploadBody.append("title", formData.title);
      uploadBody.append("region", formData.region);
      uploadBody.append("station", formData.station);
      uploadBody.append("type", formData.type);
      uploadBody.append("doi", formData.doi);
      uploadBody.append("description", formData.abstract);
      uploadBody.append("tags", formData.tags);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadBody,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const createdResourceId = data.resource?.id;

      // 2. Trigger Gemini AI Summarization if enabled
      if (generateAiDraft) {
        try {
          const aiRes = await fetch("/api/generate-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resourceId: createdResourceId,
              title: formData.title,
              region: formData.region,
              text: formData.abstract,
            }),
          });
          const aiData = await aiRes.json();
          if (!aiRes.ok) setErrorMessage("Upload saved. " + (aiData.error || "AI generation failed; review manually."));
          if (aiRes.ok && aiData.draft) {
            setAiDraftResult({
              summary: aiData.draft.suggested_summary,
              keyTakeaways: aiData.draft.key_takeaways,
              suggestedTags: aiData.draft.suggested_tags,
              socialCaption: aiData.draft.social_caption,
            });
          }
        } catch (aiErr) {
          setErrorMessage("Upload saved, but AI generation failed. You can retry from the resource review page.");
        }
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading file";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 hairline-b">
        <span className="font-mono text-xs text-deep-teal uppercase tracking-widest font-semibold">
          Data Ingestion Pipeline (Step 4 & 5)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-expedition-ink mt-1">
          Upload Polar Field Record
        </h1>
        <p className="text-xs sm:text-sm text-slate">
          Deposit new field logbooks, automated weather station timeseries, or ice core data into the private <code className="font-mono bg-[#EBF2F5] px-1 py-0.5 rounded text-deep-teal">polar_archive</code> storage bucket.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-fjord-rose/10 border border-fjord-rose/30 flex items-start gap-3 text-xs text-fjord-rose">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submitted ? (
        <div className="bg-paper-white rounded-xl p-6 sm:p-8 hairline-border polar-card-shadow space-y-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cryo-forest/20 text-cryo-forest flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-expedition-ink">
              Record Successfully Uploaded as Draft
            </h2>
            <p className="text-xs sm:text-sm text-slate max-w-lg mx-auto leading-relaxed">
              Your record &ldquo;{formData.title}&rdquo; is securely vaulted in <span className="font-mono text-deep-teal font-semibold">polar_archive</span> with status <span className="font-mono font-semibold px-2 py-0.5 bg-[#EBF2F5] text-deep-teal rounded">draft</span> and optional publisher-supplied DOI <span className="font-mono text-expedition-ink font-semibold">{formData.doi}</span>.
            </p>
          </div>

          {/* Gemini AI Generated Draft Card */}
          {aiDraftResult && (
            <div className="p-5 rounded-lg bg-[#F7F9FA] hairline-border space-y-4">
              <div className="flex items-center justify-between pb-2 hairline-b">
                <span className="font-mono text-xs font-bold text-deep-teal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-deep-teal" />
                  GEMINI DRAFT — SAVED FOR HUMAN REVIEW
                </span>
                <span className="text-[10px] font-mono text-slate bg-white px-2 py-0.5 rounded hairline-border">
                  Human review required
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-slate uppercase font-semibold block">
                    Plain-Language Summary
                  </span>
                  <p className="text-expedition-ink mt-0.5 leading-relaxed font-sans">
                    {aiDraftResult.summary}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-slate uppercase font-semibold block">
                    Key Scientific Takeaways
                  </span>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-slate">
                    {aiDraftResult.keyTakeaways.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-slate uppercase font-semibold block">
                    Suggested Topic Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {aiDraftResult.suggestedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-white text-deep-teal font-mono text-[11px] hairline-border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-slate uppercase font-semibold block">
                    Social Outreach Caption
                  </span>
                  <p className="text-slate font-mono text-[11px] p-2.5 rounded bg-white hairline-border mt-1">
                    {aiDraftResult.socialCaption}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setAiDraftResult(null);
                setSelectedFile(null);
              }}
              className="px-4 py-2 rounded-md bg-paper-white hairline-border text-xs font-semibold text-expedition-ink hover:bg-[#F2F4F5] transition-colors"
            >
              Upload Another Record
            </button>
            <Link
              href="/admin/review"
              className="px-5 py-2 rounded-md bg-deep-teal text-white text-xs font-semibold hover:bg-[#12565A] transition-colors flex items-center gap-1.5"
            >
              <span>Proceed to Review & Publish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-paper-white rounded-xl p-6 sm:p-8 hairline-border polar-card-shadow space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Publication or Dataset Title *
              </label>
              <input
                type="text"
                required
                aria-label="Resource title" maxLength={240} value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Cryospheric Region *
              </label>
              <select
                aria-label="Region" value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
              >
                <option value="Antarctica">Antarctica Continental</option>
                <option value="Arctic">The Arctic (Svalbard)</option>
                <option value="Himalaya">Himalaya (Third Pole)</option>
                <option value="Southern Ocean">Southern Ocean</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Primary Research Base *
              </label>
              <input
                type="text"
                aria-label="Research station" value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Resource Classification *
              </label>
              <select
                aria-label="Resource type" value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
              >
                <option value="report">Report / Field Logbook (PDF or TXT)</option>
                <option value="dataset">Dataset (CSV)</option>
                <option value="image">Cartographic Image Plate</option>
                <option value="video">Documentary Video Footage</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Digital Object Identifier (DOI)
              </label>
              <input
                type="text"
                aria-label="Existing DOI (optional)" value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Scientific Abstract / Methodological Context *
              </label>
              <textarea
                required
                rows={4}
                aria-label="Description" maxLength={30000} value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F9FA] rounded-md hairline-border text-expedition-ink focus:outline-none focus:border-deep-teal leading-relaxed font-sans"
              />
            </div>

            {/* File Upload Well */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-slate">
                Attach Scientific File (Auto-Vaulted to polar_archive bucket)
              </label>
              <div className="relative p-6 rounded-lg border-2 border-dashed border-contour-grey text-center space-y-2 bg-[#F7F9FA] hover:bg-[#F2F4F5] transition-colors">
                <input
                  type="file" aria-label="Resource file"
                required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-deep-teal mx-auto" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-expedition-ink">
                    {selectedFile ? selectedFile.name : "Click to select file or drag and drop"}
                  </p>
                  <p className="text-[11px] font-mono text-slate">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to vault`
                      : "PDF, TXT, CSV, PNG, JPG, WEBP, MP4 (Max 10 MB)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Gemini AI Integration Toggle */}
            <div className="sm:col-span-2 p-3.5 rounded-lg bg-[#EBF2F5]/60 hairline-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-deep-teal shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-expedition-ink block">
                    Synthesize Curatorial AI Draft via Google Gemini API
                  </span>
                  <span className="text-[11px] text-slate">
                    Sends your document or description to Google Gemini. The generated draft is saved privately for your review.
                  </span>
                </div>
              </div>
              <input
                type="checkbox" aria-label="Generate an AI draft with Gemini"
                checked={generateAiDraft}
                onChange={(e) => setGenerateAiDraft(e.target.checked)}
                className="w-4 h-4 text-deep-teal rounded accent-deep-teal cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 hairline-t flex items-center justify-end gap-3">
            <button
              type="button" onClick={() => window.location.assign("/admin/content")}
              className="px-4 py-2 rounded-md bg-paper-white hairline-border text-xs font-semibold text-slate hover:text-expedition-ink"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-md bg-deep-teal hover:bg-[#12565A] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? "Ingesting & Analyzing..." : "Deposit to polar_archive"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

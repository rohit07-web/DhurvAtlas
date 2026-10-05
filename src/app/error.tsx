"use client";
export default function ErrorPage({reset}:{reset:()=>void}) {
  return <div className="max-w-xl mx-auto p-10 space-y-4"><h1 className="text-2xl font-bold">This page could not load</h1><p>The data service may be unavailable or setup may be incomplete. No sample records have been substituted.</p><button onClick={reset} className="border rounded px-4 py-2">Try again</button></div>;
}

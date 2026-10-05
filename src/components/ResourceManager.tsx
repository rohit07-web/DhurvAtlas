"use client";
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateResourceState } from '@/lib/actions/resources';
import type { Resource } from '@/lib/resource-model';
import type { PublicationStatus } from '@/types/database';
export default function ResourceManager({resources,review=false}:{resources:Resource[];review?:boolean}) {
  const [query,setQuery] = useState('');
  const [message,setMessage] = useState('');
  const [pending,startTransition] = useTransition();
  const router = useRouter();
  const filtered = resources.filter(r=>(!review || r.publication_status !== 'published') && (r.title+' '+(r.tags || []).join(' ')).toLowerCase().includes(query.toLowerCase()));
  function change(id:string,status:PublicationStatus) {
    startTransition(async()=>{
      const result = await updateResourceState(id,status);
      setMessage(result.success ? 'Saved. Publication status has been updated.' : result.error || 'Update failed');
      if (result.success) router.refresh();
    });
  }
  return <section className="space-y-6">
    <div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-bold">{review?'Review & publish':'Content library'}</h1><Link className="text-deep-teal underline" href="/admin/upload">Upload resource</Link></div>
    <p className="text-slate">These records are loaded from Supabase. Publication is an editorial decision, not a claim of scientific peer review.</p>
    <input aria-label="Search resources" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title or tags" className="p-3 border rounded w-full"/>
    {message && <p role="status" className="p-3 bg-white border rounded">{message}</p>}
    {!filtered.length && <p className="p-8 bg-white border rounded">No matching resources. Upload a file to get started.</p>}
    {filtered.map(r=><article key={r.id} className="p-6 bg-white border rounded-xl space-y-3">
      <div className="flex justify-between gap-4"><Link className="text-lg font-semibold text-deep-teal underline" href={'/resources/'+r.id}>{r.title}</Link><span className="font-mono text-sm">{r.publication_status.replace('_',' ')}</span></div>
      <p className="text-sm text-slate">{r.description}</p>
      <div className="flex gap-3 flex-wrap">
        <Link href={'/resources/'+r.id} className="underline">Preview & edit summary</Link>
        {r.publication_status === 'draft' && <button disabled={pending} className="border rounded px-3 py-1 disabled:opacity-50" onClick={()=>change(r.id,'in_review')}>Submit for review</button>}
        {r.publication_status === 'in_review' && <><button disabled={pending} className="bg-deep-teal text-white rounded px-3 py-1 disabled:opacity-50" onClick={()=>change(r.id,'published')}>Publish</button><button disabled={pending} onClick={()=>change(r.id,'draft')}>Return to draft</button></>}
        {r.publication_status === 'published' && <button disabled={pending} className="border rounded px-3 py-1 disabled:opacity-50" onClick={()=>change(r.id,'draft')}>Unpublish</button>}
      </div>
    </article>)}
  </section>;
}

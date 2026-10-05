"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSummary } from '@/lib/actions/resources';
export default function SummaryEditor({id,initial,basis}:{id:string;initial:string;basis:string}) {
  const [text,setText] = useState(initial);
  const [source,setSource] = useState(basis);
  const [message,setMessage] = useState('');
  const [busy,start] = useTransition();
  const router = useRouter();
  function generate() { start(async()=>{
    setMessage('Generating a draft from the uploaded document or supplied description…');
    try {
      const response = await fetch('/api/generate-summary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({resourceId:id})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');
      setText(data.draft.suggested_summary);setSource(data.sourceBasis);setMessage('AI draft saved privately. Check it against the source, edit it, then save the approved summary.');
    } catch(e) {setMessage(e instanceof Error?e.message:'Generation failed');}
  }); }
  function save() {start(async()=>{
    const result = await saveSummary(id,text);
    setMessage(result.success?'Approved summary saved.':result.error || 'Save failed');
    if(result.success) router.refresh();
  });}
  return <section className="p-6 border rounded-xl bg-white space-y-4">
    <h2 className="text-xl font-bold">Admin summary review</h2>
    <p>AI output is a draft, not scientific validation. Generating a draft sends the document/description to Google Gemini. Only send content you are authorized to share.</p>
    {source && <p className="text-sm text-slate">Source basis: {source}</p>}
    <label className="block">Summary to approve<textarea aria-label="Summary to approve" maxLength={12000} className="block border rounded w-full p-3 mt-2" rows={8} value={text} onChange={e=>setText(e.target.value)}/></label>
    <div className="flex gap-4"><button disabled={busy} onClick={generate} className="border rounded px-4 py-2 disabled:opacity-50">Generate AI draft</button><button disabled={busy || !text.trim()} onClick={save} className="bg-deep-teal text-white rounded px-4 py-2 disabled:opacity-50">Save approved summary</button></div>
    <p role="status">{message}</p>
  </section>;
}

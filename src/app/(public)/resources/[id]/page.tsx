import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
import { requireAdmin } from '@/lib/access';
import SummaryEditor from '@/components/SummaryEditor';
export const dynamic = 'force-dynamic';
export default async function ResourcePage({params}:{params:Promise<{id:string}>}) {
  if (!hasSupabase()) notFound();
  const {id} = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createClient();
  const {data:r} = await db.from('resources').select('*').eq('id',id).single();
  if (!r) notFound();
  let admin = false;
  try {await requireAdmin();admin=true;} catch {}
  const draft = admin ? (await db.from('ai_drafts').select('*').eq('resource_id',id).order('created_at',{ascending:false}).limit(1).maybeSingle()).data : null;
  return <article className="max-w-4xl mx-auto p-6 sm:p-10 space-y-6">
    <Link href="/library" className="text-deep-teal underline">Back to library</Link>
    <p className="font-mono text-sm">{r.type} · {r.publication_status.replace('_',' ')} · Publisher-provided content</p>
    <h1 className="text-3xl sm:text-4xl font-bold">{r.title}</h1>
    {r.doi && <p>Publisher-supplied DOI (not independently verified): {r.doi}</p>}
    <p className="whitespace-pre-wrap">{r.description}</p>
    {r.approved_summary && <section><h2 className="text-xl font-bold mb-2">Editor-approved summary</h2><p className="whitespace-pre-wrap">{r.approved_summary}</p></section>}
    <p className="text-sm text-slate">{(r.authors || []).join(', ')} · {(r.tags || []).join(' · ')}</p>
    <div className="flex gap-5"><a className="text-deep-teal underline" href={'/api/resources/'+id+'/file?preview=1'} target="_blank" rel="noopener noreferrer">Open file preview</a><a className="text-deep-teal underline" href={'/api/resources/'+id+'/file'}>Download file</a></div>
    {admin && <SummaryEditor id={id} initial={r.approved_summary || draft?.suggested_summary || ''} basis={draft?.source_basis || ''}/>}
  </article>;
}

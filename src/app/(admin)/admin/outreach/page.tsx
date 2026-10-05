import Link from 'next/link';
import { requireAdmin } from '@/lib/access';
export default async function OutreachPage() {
  const { db } = await requireAdmin();
  const { data: stories, error } = await db.from('stories').select('*').order('updated_at',{ascending:false});
  return <div className="max-w-6xl mx-auto space-y-8">
    <header className="flex flex-wrap gap-4 justify-between items-start"><div><p className="text-xs uppercase tracking-widest text-deep-teal">Public engagement</p><h1 className="text-3xl font-bold mt-2">Outreach Studio</h1><p className="text-slate mt-3">Turn published research into clear stories for students and the public.</p></div><Link href="/admin/outreach/new" className="px-4 py-2 rounded-md bg-deep-teal text-white">New Outreach Story</Link></header>
    {error ? <p role="alert">Unable to load stories. Check the connection and outreach database setup.</p> : !stories?.length ? <div className="bg-paper-white rounded-xl border p-8"><h2 className="text-xl font-semibold">Your first story starts with a source.</h2><p className="mt-3 text-slate">Publish a resource in the library, then create a story here. Saved drafts stay private until you approve publication.</p></div> : <div className="bg-paper-white border rounded-xl divide-y">{stories.map(s => <article key={s.id} className="p-6 flex flex-wrap justify-between gap-4"><div><p className="font-mono text-xs text-deep-teal uppercase">{s.publication_status}</p><h2 className="text-xl font-semibold mt-2">{s.title}</h2><p className="text-sm text-slate mt-2">Updated {new Date(s.updated_at).toISOString().slice(0,10)} · {s.byline || 'Byline not added'}</p></div><Link className="underline self-center" href={'/admin/outreach/' + s.id}>Edit story</Link></article>)}</div>}
    <p className="text-sm text-slate">If a source is unpublished, its stories return to draft and disappear from the public portal.</p>
  </div>;
}

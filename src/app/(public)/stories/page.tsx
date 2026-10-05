import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
export const dynamic = 'force-dynamic';
export default async function StoriesPage() {
  const db = hasSupabase() ? await createClient() : null;
  const result = db ? await db.from('stories').select('id,title,excerpt,byline,updated_at,resources!inner(publication_status)').eq('publication_status','published').eq('resources.publication_status','published').order('updated_at',{ascending:false}) : null;
  return <section className="max-w-atlas mx-auto px-6 py-12 sm:py-20 space-y-10"><header className="max-w-3xl"><p className="font-mono uppercase tracking-widest text-xs text-deep-teal">Research, explained</p><h1 className="text-4xl sm:text-5xl font-bold mt-4">Polar Science Stories</h1><p className="text-lg text-slate mt-5">Explore ideas from polar research in everyday language. Every story links to its published source so you can read further.</p></header>
    {result?.error ? <p role="alert">Stories are temporarily unavailable. Please try again later.</p> : !result?.data?.length ? <div className="border rounded-xl bg-paper-white p-8"><h2 className="text-xl font-semibold">Stories are on their way.</h2><p className="mt-3">Our editors are preparing source-based stories. In the meantime, explore the published research.</p><Link className="inline-block mt-4 underline text-deep-teal" href="/library">Browse the knowledge library</Link></div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{result.data.map(s => <article key={s.id} className="border rounded-xl bg-paper-white p-7 flex flex-col gap-4"><p className="text-xs font-mono text-slate">Updated {new Date(s.updated_at).toISOString().slice(0,10)}</p><h2 className="text-2xl font-semibold"><Link href={'/stories/' + s.id} className="hover:text-deep-teal">{s.title}</Link></h2><p className="text-slate leading-relaxed flex-1">{s.excerpt}</p><p className="text-sm">By {s.byline}</p><Link className="text-deep-teal underline" href={'/stories/' + s.id}>Read story</Link></article>)}</div>}
  </section>;
}

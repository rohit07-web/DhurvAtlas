import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
import { requireAdmin } from '@/lib/access';
export const dynamic = 'force-dynamic';
export default async function StoryPage({params}: {params:Promise<{id:string}>}) {
  const {id} = await params;
  if (!hasSupabase() || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createClient();
  const {data:story,error} = await db.from('stories').select('*').eq('id',id).maybeSingle();
  if (error) throw new Error('Unable to load this story. Please retry.');
  if (!story) notFound();
  const {data:source} = await db.from('resources').select('id,title,publication_status').eq('id',story.source_resource_id).maybeSingle();
  const admin = await requireAdmin().then(() => true).catch(() => false);
  const visible = story.publication_status === 'published' && source?.publication_status === 'published';
  if (!visible && !admin) notFound();
  return <article className="max-w-3xl mx-auto px-6 py-12 space-y-7">
    <Link className="text-deep-teal underline" href="/stories">All stories</Link>
    {!visible && <p className="bg-amber-50 border p-4 rounded-lg">Private preview — this story is not available to visitors.</p>}
    {admin && <Link className="block underline text-deep-teal" href={'/admin/outreach/' + id}>Edit in Outreach Studio</Link>}
    <h1 className="text-4xl sm:text-5xl font-bold leading-tight break-words">{story.title}</h1>
    <p className="text-xl text-slate leading-relaxed">{story.excerpt}</p>
    <p className="text-sm text-slate">By {story.byline || 'Byline pending'} · Updated {new Date(story.updated_at).toISOString().slice(0,10)} · {Math.max(1,Math.ceil(story.body.trim().split(/\s+/).length / 200))} min read</p>
    <div className="space-y-6 text-lg leading-relaxed break-words">{story.body.split(/\n\s*\n/).map((paragraph,i) => <p key={i} className="whitespace-pre-wrap">{paragraph}</p>)}</div>
    <aside className="bg-paper-white border rounded-xl p-6 space-y-3"><h2 className="text-xl font-semibold">Read the source</h2>{source && <Link className="text-deep-teal underline" href={'/resources/' + source.id}>{source.title}</Link>}<p className="text-sm text-slate">An editorial explanation of the linked resource. Portal publication does not establish independent scientific verification.</p></aside>
  </article>;
}

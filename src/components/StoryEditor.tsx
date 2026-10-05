"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveStory } from '@/lib/actions/stories';
import type { Database } from '@/types/database';
type Story = Database['public']['Tables']['stories']['Row'];
type Source = Pick<Database['public']['Tables']['resources']['Row'], 'id' | 'title' | 'approved_summary' | 'publication_status'>;
const field = 'w-full border border-contour-grey rounded-md px-3 py-2 bg-white text-expedition-ink focus:outline-deep-teal';

export default function StoryEditor({ story, sources }: { story?: Story; sources: Source[] }) {
  const router = useRouter();
  const [saved, setSaved] = useState(story);
  const [sourceId, setSourceId] = useState(story?.source_resource_id || '');
  const [title, setTitle] = useState(story?.title || '');
  const [excerpt, setExcerpt] = useState(story?.excerpt || '');
  const [body, setBody] = useState(story?.body || '');
  const [byline, setByline] = useState(story?.byline || '');
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const source = sources.find(r => r.id === sourceId);
  const published = saved?.publication_status === 'published';
  async function save(status: 'draft' | 'published') {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      const result = await saveStory({ id: saved?.id, updatedAt: saved?.updated_at, sourceId, title, excerpt, body, byline, status });
      if (!result.success) { setMessage(result.error); return; }
      setSaved(result.story); setReviewed(false);
      setMessage(status === 'published' ? 'Story published. Visitors can now read it.' : 'Draft saved. It is private to administrators.');
      if (!saved) router.replace('/admin/outreach/' + result.story.id);
      router.refresh();
    } catch { setMessage('Connection failed. Your unsaved text is still here; please retry.'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-6 max-w-3xl">
    <div className="flex flex-wrap gap-4 justify-between"><span className="font-mono text-sm text-deep-teal">{published ? 'Published' : 'Private draft'}</span>{saved && <Link className="underline" href={'/stories/' + saved.id}>Open saved preview</Link>}</div>
    <p className="text-sm text-slate">Explain the research in everyday language. Keep its limitations and review every claim. Editing a published story updates the public version when you publish again.</p>
    <fieldset disabled={busy} className="space-y-5 disabled:opacity-60" onChange={() => setReviewed(false)}>
      <label className="block space-y-2"><span>Source resource</span><select className={field} value={sourceId} onChange={e => setSourceId(e.target.value)}><option value="">Select published research</option>{sources.map(r => <option key={r.id} value={r.id}>{r.title}{r.publication_status !== 'published' ? ' (unpublished)' : ''}</option>)}</select></label>
      {source && <div className="p-4 bg-[#EBF2F5] rounded-lg space-y-2 text-sm"><Link href={'/resources/' + source.id} className="underline">Read the source</Link><p>An approved summary can be copied as a starting point. This does not generate new AI content.</p><button type="button" disabled={!source.approved_summary || !!body} className="underline disabled:opacity-40" onClick={() => { setBody(source.approved_summary || ''); setReviewed(false); }}>Use approved summary as starting text</button>{body && <p>Starting-text insertion is disabled while the story contains text to prevent overwriting your work.</p>}</div>}
      <label className="block space-y-2"><span>Story title</span><input className={field} maxLength={200} value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label className="block space-y-2"><span>Short introduction</span><textarea className={field} rows={3} maxLength={500} value={excerpt} onChange={e => setExcerpt(e.target.value)} /><span className="text-xs text-slate">{excerpt.length}/500 characters</span></label>
      <label className="block space-y-2"><span>Written by</span><input className={field} maxLength={120} placeholder="Author or editorial team" value={byline} onChange={e => setByline(e.target.value)} /></label>
      <label className="block space-y-2"><span>Story body</span><textarea className={field + ' leading-relaxed'} rows={16} maxLength={30000} value={body} onChange={e => setBody(e.target.value)} /><span className="text-xs text-slate">Plain text; separate paragraphs with a blank line. {body.length}/30,000 characters.</span></label>
    </fieldset>
    <label className="flex gap-3 items-start text-sm"><input type="checkbox" checked={reviewed} disabled={busy} onChange={e => setReviewed(e.target.checked)} className="mt-1" />I have checked this story against its source and reviewed it for public release.</label>
    <div className="flex flex-wrap gap-3"><button disabled={busy || !title.trim() || !sourceId} onClick={() => save('draft')} className="px-4 py-2 rounded-md border disabled:opacity-40">{published ? 'Unpublish and save draft' : 'Save draft'}</button><button disabled={busy || !reviewed || source?.publication_status !== 'published'} onClick={() => save('published')} className="px-4 py-2 rounded-md bg-deep-teal text-white disabled:opacity-40">{busy ? 'Saving…' : published ? 'Publish changes' : 'Publish story'}</button></div>
    <p role="status" aria-live="polite" className="text-sm">{message}</p>
  </section>;
}

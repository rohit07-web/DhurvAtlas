import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/access';
import StoryEditor from '@/components/StoryEditor';
export default async function EditStory({params}: {params: Promise<{id:string}>}) {
  const {id} = await params;
  const {db} = await requireAdmin();
  const {data: sources, error} = await db.from('resources').select('id,title,approved_summary,publication_status').order('title');
  if (error) throw new Error('Unable to load source resources.');
  const {data:story, error:storyError} = id === 'new' ? {data:null,error:null} : await db.from('stories').select('*').eq('id',id).maybeSingle();
  if (storyError) throw new Error('Unable to load this story.');
  if (id !== 'new' && !story) notFound();
  return <div className="max-w-4xl mx-auto space-y-6"><Link className="text-deep-teal underline" href="/admin/outreach">Back to Outreach Studio</Link><h1 className="text-3xl font-bold">{story ? 'Edit outreach story' : 'New outreach story'}</h1><StoryEditor key={id} story={story || undefined} sources={(sources || []).filter(r => r.publication_status === 'published' || r.id === story?.source_resource_id)} /></div>;
}

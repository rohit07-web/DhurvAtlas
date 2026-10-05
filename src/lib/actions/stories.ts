"use server";
import { revalidatePath } from 'next/cache';
import { AccessError, requireAdmin } from '@/lib/access';

export async function saveStory(input: {
  id?: string; updatedAt?: string; sourceId: string; title: string;
  excerpt: string; body: string; byline: string; status: 'draft' | 'published';
}) {
  try {
    const { db } = await requireAdmin();
    const { id, updatedAt, sourceId, status } = input;
    const title = input.title.trim(), excerpt = input.excerpt.trim();
    const body = input.body.trim(), byline = input.byline.trim();
    if (!['draft','published'].includes(status) || !title || title.length > 200 ||
        excerpt.length > 500 || body.length > 30000 || byline.length > 120)
      throw new AccessError('Enter a title and keep all fields within their limits.',400);
    if (status === 'published' && (body.length < 80 || excerpt.length < 10 || !byline))
      throw new AccessError('Publishing needs a byline, an introduction of at least 10 characters, and a story of at least 80 characters.',400);
    const { data: source } = await db.from('resources').select('id,publication_status').eq('id',sourceId).single();
    if (!source || (status === 'published' && source.publication_status !== 'published'))
      throw new AccessError('Select a published source before publishing this story.',400);
    if (!id && source.publication_status !== 'published')
      throw new AccessError('New stories must start from a published resource.',400);
    const values = { source_resource_id: sourceId, title, excerpt, body, byline, publication_status: status };
    const query = id
      ? db.from('stories').update(values).eq('id',id).eq('updated_at',updatedAt || '')
      : db.from('stories').insert(values);
    const { data, error } = await query.select('*').single();
    if (error || !data) throw new AccessError('Could not save. Another editor may have changed this story; reload before trying again.',409);
    revalidatePath('/stories'); revalidatePath('/stories/' + data.id); revalidatePath('/admin/outreach');
    return { success: true as const, story: data };
  } catch (error) {
    return { success: false as const, error: error instanceof AccessError ? error.message : 'Unable to save this story. Please reload and try again.' };
  }
}

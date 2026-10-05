"use server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/access';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
import type { PublicationStatus } from '@/types/database';
export async function updateResourceState(id: string, status: PublicationStatus) {
  try {
    const { db } = await requireAdmin();
    if (!['draft','in_review','published'].includes(status)) throw new Error('Invalid status');
    const { data: current } = await db.from('resources').select('publication_status').eq('id',id).single();
    if (!current) throw new Error('Resource not found.');
    const allowed: Record<PublicationStatus, PublicationStatus[]> = {draft:['in_review'],in_review:['draft','published'],published:['draft']};
    if (!allowed[current.publication_status].includes(status)) throw new Error('Invalid transition. Drafts must be submitted for review before publication.');
    const { data, error } = await db.from('resources').update({ publication_status: status }).eq('id', id).eq('publication_status',current.publication_status).select('id').single();
    if (error || !data) throw new Error('Resource could not be updated.');
    for (const path of ['/','/library','/stories','/admin/outreach','/admin','/admin/content','/admin/review','/resources/' + id]) revalidatePath(path);
    return { success: true };
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : 'Update failed' }; }
}
export async function getPublishedResources() {
  if (!hasSupabase()) return [];
  const db = await createClient();
  const { data, error } = await db.from('resources').select('*').eq('publication_status','published').order('created_at',{ ascending:false });
  if (error) throw new Error('The resource service is unavailable.');
  return data || [];
}
export async function getAdminResources() {
  const access = await requireAdmin().catch(() => null);
  if (!access) redirect('/login');
  const { db } = access;
  const { data, error } = await db.from('resources').select('*').order('created_at',{ ascending:false });
  if (error) throw new Error('Unable to load resources. Check the database migration.');
  return data || [];
}
export async function saveSummary(id: string, summary: string) {
  try {
    const { db } = await requireAdmin();
    if (!summary.trim() || summary.length > 12000) throw new Error('Enter a summary up to 12,000 characters.');
    const { error } = await db.from('resources').update({ approved_summary: summary.trim() }).eq('id',id).select('id').single();
    if (error) throw new Error('Unable to save the approved summary.');
    revalidatePath('/resources/' + id); revalidatePath('/admin/review'); revalidatePath('/library');
    return { success:true };
  } catch(error) { return { success:false,error:error instanceof Error ? error.message : 'Save failed' }; }
}

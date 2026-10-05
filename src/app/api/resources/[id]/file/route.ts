import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: { params: Promise<{ id:string }> }) {
  if (!hasSupabase()) return Response.json({ error:'Storage is not configured.' },{ status:503 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({error:'Not found'},{status:404});
  const db = await createClient();
  // RLS permits published resources or an approved admin. No service-role bypass.
  const { data:r } = await db.from('resources').select('file_path,title').eq('id',id).single();
  if (!r?.file_path) return Response.json({error:'Not found'},{status:404});
  const { data:file,error } = await db.storage.from('polar_archive').download(r.file_path);
  if (error || !file) return Response.json({error:'File unavailable'},{status:404});
  const ext = r.file_path.split('.').pop()?.toLowerCase() || '';
  const types:Record<string,string> = {pdf:'application/pdf',txt:'text/plain; charset=utf-8',csv:'text/plain; charset=utf-8',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',mp4:'video/mp4'};
  const preview = new URL(request.url).searchParams.get('preview') === '1' && !!types[ext];
  const filename = r.title.replace(/[^a-zA-Z0-9 _-]/g,'').slice(0,90) || 'resource';
  return new Response(file,{ headers:{
    'Content-Type':types[ext] || 'application/octet-stream',
    'Content-Disposition':(preview ? 'inline' : 'attachment') + '; filename="' + filename + '.' + ext + '"',
    'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff',
    'Content-Security-Policy':"sandbox; default-src 'none'; style-src 'unsafe-inline';"
  } });
}

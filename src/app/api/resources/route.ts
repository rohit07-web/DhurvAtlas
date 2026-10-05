import { getPublishedResources } from '@/lib/actions/resources';
import { hasSupabase } from '@/lib/config';
import { toPolarRecord } from '@/lib/resource-model';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!hasSupabase()) return Response.json({ records: [], configured:false }, { headers:{'Cache-Control':'no-store'} });
  try { return Response.json({ records:(await getPublishedResources()).map(toPolarRecord), configured:true }, { headers:{'Cache-Control':'no-store'} }); }
  catch { return Response.json({ error:'Unable to load published resources.' }, { status:503 }); }
}

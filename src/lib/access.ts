import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
export class AccessError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  // Next.js may construct request.url using its internal hostname. Compare the
  // browser's origin with the incoming Host instead; browsers cannot forge Host.
  let allowed = false;
  try {
    const parsed = new URL(origin || '');
    allowed = process.env.APP_ORIGIN ? parsed.origin === process.env.APP_ORIGIN :
      ['http:', 'https:'].includes(parsed.protocol) && parsed.host === request.headers.get('host');
  } catch {}
  if (!allowed) throw new AccessError('Cross-origin requests are not allowed.', 403);
}
export async function requireAdmin() {
  if (!hasSupabase()) throw new AccessError('Supabase is not configured. Complete project setup first.', 503);
  const db = await createClient();
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user) throw new AccessError('Please sign in.', 401);
  const { data: allowed, error: roleError } = await db.rpc('is_admin');
  if (roleError || !allowed) throw new AccessError('An approved administrator account is required.', 403);
  return { db, user };
}
export function apiError(error: unknown) {
  return Response.json({ error: error instanceof AccessError ? error.message : 'The operation failed. Please retry.' }, { status: error instanceof AccessError ? error.status : 500 });
}

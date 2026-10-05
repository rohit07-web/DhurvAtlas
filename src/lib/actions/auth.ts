"use server";
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
import { requireAdmin } from '@/lib/access';
export interface AuthState { error?: string; success?: boolean }
export async function loginAction(_previous: AuthState | null, form: FormData): Promise<AuthState> {
  if (!hasSupabase()) return { error: 'Supabase is not configured. Demo credentials cannot sign in.' };
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  if (!email || !password) return { error: 'Enter your email and password.' };
  try {
    const db = await createClient();
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Unable to sign in with these credentials.' };
    try { await requireAdmin(); } catch { await db.auth.signOut(); return { error: 'This account is not an approved administrator.' }; }
  } catch { return { error: 'Authentication service unavailable.' }; }
  redirect('/admin');
}
export async function logoutAction() {
  if (hasSupabase()) { const db = await createClient(); await db.auth.signOut(); }
  redirect('/login');
}
export async function getSessionUser() {
  try { return (await requireAdmin()).user; } catch { return null; }
}

import { requireAdmin } from '@/lib/access';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  try { await requireAdmin(); } catch { redirect('/login'); }
  return children;
}

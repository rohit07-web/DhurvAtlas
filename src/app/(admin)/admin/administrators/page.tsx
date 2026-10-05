import { requireAdmin } from '@/lib/access';
export default async function Administrators() {
  const {user} = await requireAdmin();
  return <section className="space-y-5"><h1 className="text-3xl font-bold">Administrator access</h1><p>Signed in as {user.email}</p><p>Only users explicitly listed in the database admin_users table can enter this workspace or modify repository content.</p><p>The project owner manages accounts in Supabase Authentication and grants or revokes membership using the setup guide. Public sign-up does not grant administrator access.</p></section>;
}

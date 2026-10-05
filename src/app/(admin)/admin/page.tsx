import Link from 'next/link';
import { getAdminResources } from '@/lib/actions/resources';
export default async function AdminPage() {
  const records = await getAdminResources();
  return <section className="space-y-8"><h1 className="text-3xl font-bold">Repository overview</h1><p>Counts below come from the connected database.</p>
    <div className="grid sm:grid-cols-3 gap-6">{['draft','in_review','published'].map(status=><div className="p-6 rounded-xl border bg-white" key={status}><p className="capitalize">{status.replace('_',' ')}</p><strong className="text-4xl">{records.filter(r=>r.publication_status===status).length}</strong></div>)}</div>
    <div className="flex gap-6"><Link className="underline text-deep-teal" href="/admin/upload">Upload a resource</Link><Link className="underline text-deep-teal" href="/admin/review">Review & publish</Link><Link className="underline text-deep-teal" href="/admin/content">Manage content</Link></div>
    <p className="text-slate">Uploads are private until published. AI drafts require human review. Unpublishing removes public access to the resource and its file for new requests; previously downloaded copies cannot be recalled.</p>
  </section>;
}

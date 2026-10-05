import { hasSupabase, configured } from '@/lib/config';
export default function Settings() {
  return <section className="space-y-5"><h1 className="text-3xl font-bold">Service configuration</h1><p>Configuration is managed by the project owner in .env.local or the deployment environment. Secret values are never shown here.</p><ul className="space-y-3"><li>Supabase: {hasSupabase()?'Configured (connectivity must be tested)':'Not configured'}</li><li>Gemini: {configured(process.env.GEMINI_API_KEY)?'Configured (connectivity must be tested)':'Not configured'}</li><li>DOI registration: Not provided</li><li>Live station telemetry: Not connected</li></ul><p>Restart the application after changing environment variables.</p></section>;
}

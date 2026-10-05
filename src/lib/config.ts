export function configured(value: string | undefined) {
  return !!value && !/placeholder|your-|example/i.test(value);
}
export function hasSupabase() {
  return configured(process.env.NEXT_PUBLIC_SUPABASE_URL) && configured(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

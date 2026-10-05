import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasSupabase } from '@/lib/config';
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');
  if (!hasSupabase()) return response;
  const db = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name,value));
        response = NextResponse.next({ request });
        values.forEach(({ name,value,options }) => response.cookies.set(name,value,options));
        response.headers.set('Cache-Control','private, no-store');
      }
    }
  });
  await db.auth.getUser();
  return response;
}
export const config = { matcher: ['/admin/:path*','/login','/api/:path*','/resources/:path*','/stories/:path*'] };

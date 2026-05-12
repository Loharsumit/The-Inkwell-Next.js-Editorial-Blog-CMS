import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Base client for use in build-time functions like generateStaticParams or generateMetadata
// where cookies() and request context are not available.
export function createBaseClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

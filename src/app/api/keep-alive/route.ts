import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We do a direct fetch to the Supabase REST API using the public anon key.
    // This is extremely lightweight and completely safe to expose.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    // Ping the 'posts' table, selecting only 1 ID, and ensuring Next.js doesn't cache the request.
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`Failed to ping Supabase: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: 'Supabase Database pinged successfully to prevent pausing.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// POST /api/revalidate?secret=xxx&slug=my-post
// Allows external triggers (e.g., Supabase webhooks, CI) to revalidate ISR pages
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  revalidatePath('/');

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? 'all',
    now: Date.now(),
  });
}

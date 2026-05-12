import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Estimate read time from markdown content (~200 wpm)
function estimateReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// GET /api/posts — public, paginated list of published posts
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);
  const tag = searchParams.get('tag');
  const all = searchParams.get('all') === 'true'; // admin: fetch all posts

  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (!all) {
    query = query.eq('published', true);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    posts: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  });
}

// POST /api/posts — protected, create a new post
export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, content_md, excerpt, cover_image, published, tags } = body;

  if (!title || !slug || !content_md) {
    return NextResponse.json(
      { error: 'title, slug, and content_md are required' },
      { status: 400 }
    );
  }

  const read_time_minutes = estimateReadTime(content_md);

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      slug,
      content_md,
      excerpt: excerpt ?? null,
      cover_image: cover_image ?? null,
      published: published ?? false,
      tags: tags ?? null,
      author_id: user.id,
      read_time_minutes,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

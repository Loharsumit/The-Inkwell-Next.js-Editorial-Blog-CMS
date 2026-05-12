import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

function estimateReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// GET /api/posts/[id] — single post by ID (admin use)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}

// PUT /api/posts/[id] — protected, update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.title !== undefined)      updateData.title = body.title;
  if (body.slug !== undefined)       updateData.slug = body.slug;
  if (body.excerpt !== undefined)    updateData.excerpt = body.excerpt;
  if (body.cover_image !== undefined) updateData.cover_image = body.cover_image;
  if (body.published !== undefined)  updateData.published = body.published;
  if (body.tags !== undefined)       updateData.tags = body.tags;
  if (body.content_md !== undefined) {
    updateData.content_md = body.content_md;
    updateData.read_time_minutes = estimateReadTime(body.content_md as string);
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // On-demand ISR revalidation for the updated post slug
  if (data?.slug) {
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath('/');
  }

  return NextResponse.json(data);
}

// DELETE /api/posts/[id] — protected, delete a post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch slug before deletion for cache revalidation
  const { data: existing } = await supabase
    .from('posts')
    .select('slug')
    .eq('id', params.id)
    .single();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existing?.slug) {
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath('/');
  }

  return NextResponse.json({ success: true });
}

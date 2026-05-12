import { createClient } from '@/utils/supabase/server';
import { PostEditor } from '@/components/admin/PostEditor';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Post } from '@/types';

export const metadata: Metadata = { title: 'Edit Post' };

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="h-full flex flex-col">
      <PostEditor initialPost={data as Post} />
    </div>
  );
}

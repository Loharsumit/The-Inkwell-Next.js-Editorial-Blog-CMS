import { createBaseClient } from '@/utils/supabase/base';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Every post ever published on The Inkwell.',
};

export const revalidate = 60;

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const supabase = createBaseClient();
  const activeTag = searchParams.tag ?? null;

  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (activeTag) {
    query = query.contains('tags', [activeTag]);
  }

  const { data: posts } = await query;
  const allPosts = (posts as Post[]) ?? [];

  // Collect all unique tags for the filter bar
  const allTagsSet = new Set<string>();
  allPosts.forEach((p) => p.tags?.forEach((t) => allTagsSet.add(t)));
  const allTags = Array.from(allTagsSet).sort();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px bg-accent" />
          <span
            className="font-ui text-xs text-accent tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Archive
          </span>
        </div>
        <h1
          className="font-display text-4xl md:text-5xl font-bold text-ink-900"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          All{' '}
          <em className="not-italic text-accent">{allPosts.length}</em>{' '}
          {allPosts.length === 1 ? 'story' : 'stories'}
        </h1>
      </header>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 animate-fade-up animate-delay-100">
          <a
            href="/archive"
            className={`tag-pill ${!activeTag ? 'bg-ink-900 text-parchment-100 border-ink-900' : ''}`}
          >
            All
          </a>
          {allTags.map((tag) => (
            <a
              key={tag}
              href={`/archive?tag=${encodeURIComponent(tag)}`}
              className={`tag-pill ${activeTag === tag ? 'bg-ink-900 text-parchment-100 border-ink-900' : ''}`}
            >
              {tag}
            </a>
          ))}
        </div>
      )}

      {/* Posts */}
      {allPosts.length === 0 ? (
        <p
          className="font-display text-2xl italic text-ink-200 text-center py-20"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          No posts found{activeTag ? ` for #${activeTag}` : ''}.
        </p>
      ) : (
        <section className="animate-fade-up animate-delay-200">
          {allPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </div>
  );
}

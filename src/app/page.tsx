import { createBaseClient } from '@/utils/supabase/base';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Inkwell — A Thoughtful Blog',
  description: 'Long-form writing on technology, craft, and ideas worth sharing.',
};

// ISR — revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const supabase = createBaseClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20);

  const allPosts = (posts as Post[]) ?? [];
  const [featured, ...rest] = allPosts;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero heading */}
      <header className="mb-16 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px bg-accent" />
          <span
            className="font-ui text-xs text-accent tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Latest Writing
          </span>
        </div>
        <h1
          className="font-display text-5xl md:text-6xl font-bold text-ink-900 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Ideas worth
          <br />
          <em className="text-accent not-italic">dwelling on.</em>
        </h1>
        <p
          className="font-body text-ink-500 text-xl mt-4 max-w-xl leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          A curated space for long-form essays, tutorials, and reflections on
          technology and craft.
        </p>
      </header>

      {allPosts.length === 0 ? (
        <div className="text-center py-32 text-ink-300">
          <p
            className="font-display text-2xl italic"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            No stories yet.
          </p>
          <p className="font-ui text-sm mt-2" style={{ fontFamily: 'var(--font-ui)' }}>
            Check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <section className="mb-12 animate-fade-up animate-delay-100">
              <PostCard post={featured} featured />
            </section>
          )}

          {/* Divider */}
          {rest.length > 0 && (
            <div className="flex items-center gap-4 mb-8 animate-fade-up animate-delay-200">
              <hr className="flex-1 border-ink-100" />
              <span
                className="font-ui text-xs text-ink-300 tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                More Stories
              </span>
              <hr className="flex-1 border-ink-100" />
            </div>
          )}

          {/* Post list */}
          <section className="animate-fade-up animate-delay-300">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

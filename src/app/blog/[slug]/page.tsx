import { createBaseClient } from '@/utils/supabase/base';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { Clock, Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Post } from '@/types';

// ── SSG: pre-render all published slugs ──────────────────────────
export async function generateStaticParams() {
  const supabase = createBaseClient();
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true);

  return (data ?? []).map((p) => ({ slug: p.slug }));
}

// ── ISR: re-generate post page every 60 s ───────────────────────
export const revalidate = 60;

// ── Dynamic OG / SEO metadata ────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createBaseClient();
  const { data } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image, created_at')
    .eq('slug', params.slug)
    .single();

  if (!data) return { title: 'Post Not Found' };

  return {
    title: data.title,
    description: data.excerpt ?? undefined,
    openGraph: {
      title: data.title,
      description: data.excerpt ?? undefined,
      images: data.cover_image ? [{ url: data.cover_image }] : [],
      type: 'article',
      publishedTime: data.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt ?? undefined,
      images: data.cover_image ? [data.cover_image] : [],
    },
  };
}

// ── Page Component ────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createBaseClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!data) notFound();

  const post = data as Post;
  const date = format(new Date(post.created_at), 'MMMM d, yyyy');

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-ui text-sm text-ink-400 hover:text-ink-800 mb-10 transition-colors"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <ArrowLeft size={14} />
        All Posts
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-up">
          {post.tags.map((tag) => (
            <span key={tag} className="tag-pill flex items-center gap-1">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1
        className="font-display text-4xl md:text-5xl font-bold text-ink-900 mb-6 leading-tight animate-fade-up animate-delay-100"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p
          className="font-body text-xl text-ink-500 leading-relaxed mb-8 italic animate-fade-up animate-delay-200"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {post.excerpt}
        </p>
      )}

      {/* Meta */}
      <div
        className="flex flex-wrap items-center gap-5 font-ui text-xs text-ink-400 tracking-wide mb-12 pb-8 border-b border-ink-100 animate-fade-up animate-delay-200"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {date}
        </span>
        {post.read_time_minutes && (
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {post.read_time_minutes} min read
          </span>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-ink drop-cap max-w-none animate-fade-up animate-delay-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.content_md}
        </ReactMarkdown>
      </div>

      {/* Footer rule */}
      <footer className="mt-16 pt-8 border-t border-ink-100">
        <div className="flex items-center gap-4">
          <span className="block w-12 h-px bg-accent" />
          <Link
            href="/"
            className="btn-outline"
          >
            ← Back to all posts
          </Link>
        </div>
      </footer>
    </article>
  );
}

import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const date = format(new Date(post.created_at), 'MMM d, yyyy');

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="block group">
        <article className="post-card relative overflow-hidden border border-ink-100 bg-parchment-50 p-8 md:p-12">
          {/* Corner decoration */}
          <span
            className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-ink-200"
            aria-hidden="true"
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}

          <h2
            className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-4 leading-tight group-hover:text-accent transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="font-body text-ink-600 text-lg leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <footer className="flex items-center justify-between">
            <div
              className="flex items-center gap-4 font-ui text-xs text-ink-400 tracking-wide"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <time dateTime={post.created_at}>{date}</time>
              {post.read_time_minutes && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.read_time_minutes} min read
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 font-ui text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-ui)' }}>
              Read <ArrowRight size={14} />
            </span>
          </footer>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="post-card py-8 border-b border-ink-100 flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}

          <h2
            className="font-display text-xl font-bold text-ink-900 mb-2 leading-snug group-hover:text-accent transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="font-body text-ink-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}

          <div
            className="flex items-center gap-4 font-ui text-xs text-ink-400 tracking-wide"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <time dateTime={post.created_at}>{date}</time>
            {post.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.read_time_minutes} min read
              </span>
            )}
          </div>
        </div>

        <div className="sm:w-6 flex items-center self-center">
          <ArrowRight
            size={18}
            className="text-ink-200 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </article>
    </Link>
  );
}

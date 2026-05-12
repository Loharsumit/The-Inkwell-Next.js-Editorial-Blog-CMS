import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { format } from 'date-fns';
import { PenLine, Plus } from 'lucide-react';
import type { Post } from '@/types';
import { AdminPostActions } from '@/components/admin/AdminPostActions';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user!.id)
    .order('created_at', { ascending: false });

  const allPosts = (posts as Post[]) ?? [];
  const published = allPosts.filter((p) => p.published).length;
  const drafts = allPosts.length - published;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="font-display text-3xl font-bold text-ink-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your Posts
          </h1>
          <p
            className="font-ui text-sm text-ink-400 mt-1"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/editor" className="btn-ink flex items-center gap-2">
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Posts', value: allPosts.length },
          { label: 'Published', value: published },
          { label: 'Drafts', value: drafts },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-parchment-50 border border-ink-100 p-5 rounded-sm"
          >
            <p
              className="font-ui text-xs text-ink-400 tracking-widest uppercase mb-1"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {label}
            </p>
            <p
              className="font-display text-3xl font-bold text-ink-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Posts table */}
      {allPosts.length === 0 ? (
        <div className="bg-parchment-50 border border-ink-100 p-16 text-center">
          <PenLine size={32} className="text-ink-200 mx-auto mb-4" />
          <p
            className="font-display text-xl font-semibold text-ink-400 italic"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nothing written yet.
          </p>
          <Link href="/admin/editor" className="btn-ink mt-6 inline-block">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="bg-parchment-50 border border-ink-100 overflow-hidden">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-ink-100 bg-parchment-100">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Tags</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {allPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-parchment-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/editor/${post.id}`}
                      className="font-body text-sm font-medium text-ink-800 hover:text-accent transition-colors line-clamp-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p
                        className="font-ui text-xs text-ink-300 mt-0.5 line-clamp-1"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span
                      className="font-ui text-xs text-ink-400"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(post.tags ?? []).slice(0, 2).map((tag) => (
                        <span key={tag} className="tag-pill text-[10px] py-0.5 px-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block font-ui text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm ${
                        post.published
                          ? 'bg-green-50 text-green-700'
                          : 'bg-ink-100 text-ink-400'
                      }`}
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <AdminPostActions post={post} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

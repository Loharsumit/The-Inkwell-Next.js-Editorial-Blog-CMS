'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/types';

interface AdminPostActionsProps {
  post: Post;
}

export function AdminPostActions({ post }: AdminPostActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleTogglePublish() {
    setLoading(true);
    await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Toggle publish */}
      <button
        onClick={handleTogglePublish}
        disabled={loading}
        className="p-2 rounded hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
        title={post.published ? 'Unpublish' : 'Publish'}
      >
        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>

      {/* Edit */}
      <Link
        href={`/admin/editor/${post.id}`}
        className="p-2 rounded hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
        title="Edit"
      >
        <Pencil size={14} />
      </Link>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2 rounded hover:bg-accent text-ink-400 hover:text-white transition-colors"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Save,
  Eye,
  EyeOff,
  Globe,
  FileText,
  Tag,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { Post, CreatePostInput } from '@/types';

interface PostEditorProps {
  initialPost?: Post;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function PostEditor({ initialPost }: PostEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialPost);

  const [title, setTitle]             = useState(initialPost?.title ?? '');
  const [slug, setSlug]               = useState(initialPost?.slug ?? '');
  const [excerpt, setExcerpt]         = useState(initialPost?.excerpt ?? '');
  const [contentMd, setContentMd]     = useState(initialPost?.content_md ?? '');
  const [tags, setTags]               = useState<string[]>(initialPost?.tags ?? []);
  const [tagInput, setTagInput]       = useState('');
  const [published, setPublished]     = useState(initialPost?.published ?? false);
  const [preview, setPreview]         = useState(false);
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const [slugEdited, setSlugEdited]   = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  async function handleSave(publishOverride?: boolean) {
    setSaveStatus('saving');

    const payload: CreatePostInput = {
      title,
      slug,
      content_md: contentMd,
      excerpt: excerpt || null,
      cover_image: null,
      published: publishOverride !== undefined ? publishOverride : published,
      tags: tags.length ? tags : null,
    };

    try {
      const res = isEditing
        ? await fetch(`/api/posts/${initialPost!.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        setSaveStatus('error');
        return;
      }

      const saved = await res.json();
      setSaveStatus('saved');
      if (publishOverride !== undefined) setPublished(publishOverride);

      setTimeout(() => setSaveStatus('idle'), 3000);

      if (!isEditing) {
        router.push(`/admin/editor/${saved.id}`);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    }
  }

  const wordCount = contentMd.trim().split(/\s+/).filter(Boolean).length;
  const readTime  = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="flex flex-col h-full">
      {/* ── Top toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1
          className="font-display text-2xl font-bold text-ink-900 mr-auto"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {isEditing ? 'Edit Post' : 'New Post'}
        </h1>

        {/* Word count */}
        <span
          className="font-ui text-xs text-ink-300"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {wordCount} words · {readTime} min
        </span>

        {/* Save status */}
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-1 text-green-600 font-ui text-xs" style={{ fontFamily: 'var(--font-ui)' }}>
            <CheckCircle2 size={13} /> Saved
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="flex items-center gap-1 text-red-500 font-ui text-xs" style={{ fontFamily: 'var(--font-ui)' }}>
            <AlertCircle size={13} /> Error saving
          </span>
        )}

        {/* Preview toggle */}
        <button
          onClick={() => setPreview(!preview)}
          className="btn-outline flex items-center gap-2 py-2 px-3"
        >
          {preview ? <EyeOff size={14} /> : <Eye size={14} />}
          {preview ? 'Editor' : 'Preview'}
        </button>

        {/* Save draft */}
        <button
          onClick={() => handleSave()}
          disabled={saveStatus === 'saving'}
          className="btn-outline flex items-center gap-2 py-2 px-3"
        >
          <Save size={14} />
          {saveStatus === 'saving' ? 'Saving…' : 'Save Draft'}
        </button>

        {/* Publish / Unpublish */}
        <button
          onClick={() => handleSave(!published)}
          disabled={saveStatus === 'saving'}
          className="btn-accent flex items-center gap-2 py-2 px-3"
        >
          <Globe size={14} />
          {published ? 'Unpublish' : 'Publish'}
        </button>
      </div>

      {/* ── Metadata fields ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block font-ui text-xs text-ink-400 tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your post title…"
            className="w-full bg-parchment-50 border border-ink-200 px-4 py-3 font-display text-xl text-ink-900 placeholder-ink-200 focus:outline-none focus:border-ink-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-ui text-xs text-ink-400 tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            placeholder="my-post-slug"
            className="w-full bg-parchment-50 border border-ink-200 px-4 py-2.5 font-mono text-sm text-ink-700 placeholder-ink-200 focus:outline-none focus:border-ink-400 transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-ui text-xs text-ink-400 tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
            Excerpt
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary…"
            className="w-full bg-parchment-50 border border-ink-200 px-4 py-2.5 font-body text-sm text-ink-700 placeholder-ink-200 focus:outline-none focus:border-ink-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block font-ui text-xs text-ink-400 tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
            Tags
          </label>
          <div className="flex flex-wrap gap-2 p-2 bg-parchment-50 border border-ink-200 min-h-[44px] items-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 tag-pill cursor-default"
              >
                <Tag size={9} />
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-0.5 hover:text-accent">
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag, press Enter"
              className="flex-1 min-w-24 bg-transparent outline-none font-ui text-xs text-ink-700 placeholder-ink-200"
              style={{ fontFamily: 'var(--font-ui)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Editor / Preview pane ────────────────────────────────── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-0 border border-ink-200 overflow-hidden">
        {/* Markdown editor */}
        <div className={`${preview ? 'hidden lg:flex' : 'flex'} flex-col`}>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-dark border-b border-white/10">
            <FileText size={13} className="text-parchment-300" />
            <span className="font-ui text-xs text-parchment-300 tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>
              Markdown
            </span>
          </div>
          <textarea
            value={contentMd}
            onChange={(e) => setContentMd(e.target.value)}
            placeholder="# Start writing…&#10;&#10;Tell your story in Markdown."
            className="editor-pane flex-1 p-6 w-full"
            spellCheck
          />
        </div>

        {/* Preview */}
        <div
          className={`${!preview ? 'hidden lg:flex' : 'flex'} flex-col border-l border-ink-100 overflow-y-auto bg-parchment-50`}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-parchment-100 border-b border-ink-100">
            <Eye size={13} className="text-ink-400" />
            <span className="font-ui text-xs text-ink-400 tracking-wider" style={{ fontFamily: 'var(--font-ui)' }}>
              Preview
            </span>
          </div>
          <div className="prose prose-ink max-w-none p-6 flex-1">
            {contentMd ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentMd}
              </ReactMarkdown>
            ) : (
              <p className="text-ink-200 italic font-body" style={{ fontFamily: 'var(--font-body)' }}>
                Start writing to see a preview…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About The Inkwell — a space for thoughtful long-form writing.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px bg-accent" />
          <span
            className="font-ui text-xs text-accent tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            About
          </span>
        </div>
        <h1
          className="font-display text-5xl font-bold text-ink-900 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The Inkwell
        </h1>
      </header>

      <div className="prose prose-ink drop-cap animate-fade-up animate-delay-100">
        <p>
          <strong>The Inkwell</strong> is a personal publishing platform for long-form
          writing on technology, craft, and ideas. It was built as a demonstration
          of modern web architecture — SSG, ISR, and API Routes — using{' '}
          <strong>Next.js 14</strong>, <strong>TypeScript</strong>, and{' '}
          <strong>Supabase</strong>.
        </p>
        <p>
          Posts are written in Markdown and statically generated at build time,
          served instantly from the edge, and incrementally revalidated whenever
          new content is published — striking the right balance between performance
          and freshness.
        </p>
        <h2>The Stack</h2>
        <ul>
          <li><strong>Next.js 14</strong> — App Router, SSG, ISR, API Routes</li>
          <li><strong>TypeScript</strong> — end-to-end type safety</li>
          <li><strong>Tailwind CSS</strong> — utility-first styling with a custom design system</li>
          <li><strong>Supabase</strong> — PostgreSQL database, Row-Level Security, and GitHub OAuth</li>
          <li><strong>Vercel</strong> — zero-config deployment with edge caching</li>
        </ul>
        <h2>Open Graph & SEO</h2>
        <p>
          Every post generates dynamic Open Graph and Twitter card metadata via{' '}
          Next.js <code>generateMetadata</code>, ensuring rich link previews when
          shared on social platforms.
        </p>
      </div>
    </div>
  );
}

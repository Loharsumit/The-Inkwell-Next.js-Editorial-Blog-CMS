import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span
        className="font-display text-[10rem] font-bold text-ink-100 leading-none select-none"
        style={{ fontFamily: 'var(--font-display)' }}
        aria-hidden="true"
      >
        404
      </span>
      <h1
        className="font-display text-3xl font-bold text-ink-900 -mt-8 mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Page not found
      </h1>
      <p
        className="font-body text-ink-400 text-lg max-w-sm mb-10"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <a href="/" className="btn-ink">
        Go home
      </a>
    </div>
  );
}

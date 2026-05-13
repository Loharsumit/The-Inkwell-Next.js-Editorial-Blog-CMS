import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'The Inkwell — A Thoughtful Blog',
    template: '%s | The Inkwell',
  },
  description: 'A curated space for long-form writing on technology, craft, and ideas.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Inkwell',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-ink-100 py-10 mt-20">
            <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span
                className="font-display text-xl font-bold tracking-tight text-ink-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                The Inkwell
              </span>
              <p className="font-ui text-xs text-ink-400 tracking-wide" style={{ fontFamily: 'var(--font-ui)' }}>
                © {new Date().getFullYear()} — Built with Next.js & Supabase
              </p>
            </div>
          </footer>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PenLine, Menu, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href ? 'text-ink-900' : 'text-ink-400 hover:text-ink-800';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-parchment-50/95 backdrop-blur-md border-b border-ink-100 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-ink-900 hover:text-accent transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The Inkwell
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', href: '/' },
            { label: 'Archive', href: '/archive' },
            { label: 'About', href: '/about' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`font-ui text-sm font-medium tracking-wide transition-colors ${isActive(href)}`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <Link
              href="/admin"
              className="flex items-center gap-2 btn-ink"
            >
              <PenLine size={14} />
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-ink">
              Sign In
            </Link>
          )}
          
          <div className="w-px h-6 bg-ink-200" />
          <ThemeToggle />
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            className="p-2 text-ink-800"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-parchment-50 border-t border-ink-100 px-6 py-4 flex flex-col gap-4 animate-fade-in">
          {[
            { label: 'Home', href: '/' },
            { label: 'Archive', href: '/archive' },
            { label: 'About', href: '/about' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`font-ui text-sm font-medium tracking-wide ${isActive(href)}`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="btn-ink self-start">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-ink self-start">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

'use client';

import { createClient } from '@/utils/supabase/client';
import { Github } from 'lucide-react';
import type { Metadata } from 'next';

export default function LoginPage() {
  const supabase = createClient();

  async function handleGitHubLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="relative bg-white dark:bg-ink-950 border border-ink-100 dark:border-ink-800 p-10 shadow-xl">
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-ink-200 dark:border-ink-800" />

          <div className="mb-8 text-center">
            <h1
              className="font-display text-3xl font-bold text-ink-900 dark:text-ink-50 mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Welcome back
            </h1>
            <p
              className="font-body text-ink-400 dark:text-ink-400 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Sign in to access your writing dashboard
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <hr className="flex-1 border-ink-100 dark:border-ink-800" />
            <span className="font-ui text-xs text-ink-300 dark:text-ink-500 tracking-widest" style={{ fontFamily: 'var(--font-ui)' }}>
              CONTINUE WITH
            </span>
            <hr className="flex-1 border-ink-100 dark:border-ink-800" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGitHubLogin}
              className="w-full flex items-center justify-center gap-3 btn-ink py-3 text-sm"
              id="github-login-btn"
            >
              <Github size={18} />
              Continue with GitHub
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-ink-50 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors py-3 text-sm font-medium"
              id="google-login-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p
            className="mt-8 text-center font-ui text-xs text-ink-300 leading-relaxed"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            By signing in, you agree to our terms of use.
            <br />
            Only authorized authors can publish posts.
          </p>
        </div>
      </div>
    </div>
  );
}

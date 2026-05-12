'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PenLine,
  LogOut,
  BookOpen,
} from 'lucide-react';

const navItems = [
  { label: 'Posts', href: '/admin', icon: LayoutDashboard },
  { label: 'New Post', href: '/admin/editor', icon: PenLine },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-ink-200 bg-parchment-50 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-ink-100 flex items-center gap-2">
        <BookOpen size={18} className="text-accent" />
        <span
          className="font-display text-lg font-bold text-ink-900"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Inkwell CMS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all
                ${
                  active
                    ? 'bg-ink-900 text-parchment-100'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-ink-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-ink-400 hover:text-accent hover:bg-red-50 transition-all"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

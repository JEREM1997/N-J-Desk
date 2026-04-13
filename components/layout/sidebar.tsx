'use client';

import type { Route } from 'next';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Hammer, CheckSquare, Wallet, FolderOpen, Wrench, Settings } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { cn } from '@/lib/utils';
import { getStoredSession } from '@/lib/supabase';

const links: { href: Route; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Chantiers', icon: Hammer },
  { href: '/tasks', label: 'Tâches', icon: CheckSquare },
  { href: '/finance', label: 'Finances', icon: Wallet },
  { href: '/documents', label: 'Documents', icon: FolderOpen },
  { href: '/sav', label: 'SAV', icon: Wrench },
  { href: '/settings', label: 'Paramètres', icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<string>('Utilisateur connecté');

  useEffect(() => {
    const session = getStoredSession();
    const email = session?.user.email?.trim();
    if (email) {
      setCurrentUser(email);
      return;
    }

    const shortId = session?.user.id?.slice(0, 8);
    if (shortId) {
      setCurrentUser(`Utilisateur #${shortId}`);
    }
  }, []);

  return (
    <aside className="relative hidden w-80 shrink-0 border-r border-white/60 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-900 px-6 py-7 text-zinc-100 shadow-2xl md:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="relative z-10">
        <BrandLogo />
        <nav className="mt-10 space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all duration-200',
                  isActive
                    ? 'bg-white/14 text-white shadow-lg shadow-black/20'
                    : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4 transition-transform duration-200 group-hover:scale-110', isActive && 'text-amber-200')} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">Connecté en tant que</p>
          <p className="mt-1 truncate text-sm font-medium text-zinc-100">{currentUser}</p>
        </div>
        <p className="mt-4 text-[11px] text-zinc-400">N&J Desk · Pilotage premium des chantiers</p>
      </div>
    </aside>
  );
}

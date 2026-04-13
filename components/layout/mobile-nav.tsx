'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getStoredSession } from '@/lib/supabase';

const links: { href: Route; label: string }[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/projects', label: 'Chantiers' },
  { href: '/tasks', label: 'Tâches' },
  { href: '/finance', label: 'Finances' },
  { href: '/documents', label: 'Documents' },
  { href: '/sav', label: 'SAV' },
  { href: '/settings', label: 'Paramètres' }
];

export function MobileNav() {
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
    <div className="mt-3 space-y-2">
      <p className="truncate text-xs text-muted">
        Connecté : <span className="font-medium text-foreground">{currentUser}</span>
      </p>
      <nav className="flex gap-2 overflow-x-auto pb-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium',
                isActive ? 'border-black/20 bg-black text-white' : 'border-black/10 bg-white text-zinc-700'
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

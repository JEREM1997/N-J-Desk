'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
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

  return (
    <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
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
  );
}

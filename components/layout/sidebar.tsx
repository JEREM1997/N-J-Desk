'use client';

import type { Route } from 'next';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Hammer, CheckSquare, Settings } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { cn } from '@/lib/utils';

const links: { href: Route; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Chantiers', icon: Hammer },
  { href: '/tasks', label: 'Tâches', icon: CheckSquare },
  { href: '/settings', label: 'Paramètres', icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative hidden w-72 shrink-0 border-r border-white/60 bg-gradient-to-b from-zinc-950 to-zinc-900 px-5 py-6 text-zinc-100 shadow-2xl md:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="relative z-10">
        <BrandLogo />
        <nav className="mt-10 space-y-1.5">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                  isActive
                    ? 'bg-white/12 text-white shadow-lg shadow-black/20'
                    : 'text-zinc-300 hover:bg-white/8 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4 transition-transform duration-200 group-hover:scale-110', isActive && 'text-amber-200')} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

import type { Route } from 'next';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Hammer, CheckSquare, Settings } from 'lucide-react';
import { BrandLogo } from './brand-logo';

const links: { href: Route; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Chantiers', icon: Hammer },
  { href: '/tasks', label: 'Tâches', icon: CheckSquare },
  { href: '/settings', label: 'Paramètres', icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-white/80 px-5 py-6 backdrop-blur md:block">
      <BrandLogo />
      <nav className="mt-10 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-black/5 hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

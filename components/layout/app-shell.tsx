import { Sidebar } from '@/components/layout/sidebar';
import { BrandLogo } from '@/components/layout/brand-logo';
import { MobileNav } from '@/components/layout/mobile-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent md:flex">
      <Sidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-background/80 px-5 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <BrandLogo compact />
          </div>
          <MobileNav />
        </header>
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-9">{children}</div>
      </main>
    </div>
  );
}

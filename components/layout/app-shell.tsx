import { Sidebar } from '@/components/layout/sidebar';
import { BrandLogo } from '@/components/layout/brand-logo';
import { MobileNav } from '@/components/layout/mobile-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent md:flex">
      <Sidebar />
      <main className="relative flex-1">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <BrandLogo compact />
          </div>
          <MobileNav />
        </header>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-5 sm:px-6 md:px-8 md:py-8 xl:px-10">{children}</div>
      </main>
    </div>
  );
}

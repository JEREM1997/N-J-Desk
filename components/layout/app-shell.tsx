import { Sidebar } from '@/components/layout/sidebar';
import { BrandLogo } from '@/components/layout/brand-logo';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent md:flex">
      <Sidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/70 bg-background/80 px-5 py-4 backdrop-blur md:hidden">
          <BrandLogo compact />
        </header>
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-9">{children}</div>
      </main>
    </div>
  );
}

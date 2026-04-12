import { Sidebar } from '@/components/layout/sidebar';
import { BrandLogo } from '@/components/layout/brand-logo';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/90 px-5 py-4 backdrop-blur md:hidden">
          <BrandLogo compact />
        </header>
        <div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}

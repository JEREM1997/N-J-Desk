import { BrandLogo } from '@/components/layout/brand-logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute -top-28 right-[-5%] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-[-5%] h-80 w-80 rounded-full bg-black/5 blur-3xl" />
      <div className="relative w-full max-w-md space-y-8 animate-fadeIn">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        {children}
      </div>
    </main>
  );
}

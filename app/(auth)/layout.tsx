import { BrandLogo } from '@/components/layout/brand-logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        {children}
      </div>
    </main>
  );
}

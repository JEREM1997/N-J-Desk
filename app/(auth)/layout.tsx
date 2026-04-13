import { BrandLogo } from '@/components/layout/brand-logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(205,178,132,0.24),transparent_34%),radial-gradient(circle_at_90%_0%,rgba(255,255,255,0.08),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 md:px-10 lg:grid-cols-2">
        <section className="hidden space-y-7 lg:block">
          <BrandLogo />
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
            L’excellence chantier, dans une expérience digitale nette et premium.
          </h1>
          <p className="max-w-lg text-sm text-zinc-300">
            N&J Desk centralise clients, chantiers, finances et SAV avec une interface élégante, rapide et rassurante.
          </p>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.1em] text-zinc-400">Pilotage</p>
              <p className="mt-2 text-sm font-medium">Vue globale en temps réel</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.1em] text-zinc-400">Fiabilité</p>
              <p className="mt-2 text-sm font-medium">Données sécurisées Supabase</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.1em] text-zinc-400">Standing</p>
              <p className="mt-2 text-sm font-medium">UI premium orientée usage</p>
            </div>
          </div>
        </section>

        <div className="relative w-full max-w-md justify-self-center space-y-8 animate-fadeIn lg:justify-self-end">
          <div className="flex justify-center lg:hidden">
            <BrandLogo />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}

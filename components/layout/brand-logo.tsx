import Link from 'next/link';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="group inline-flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl border bg-white shadow-sm transition group-hover:scale-[1.02]">
        <span className="text-sm font-semibold">N&J</span>
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-semibold tracking-tight">N&J Desk</p>
          <p className="text-xs text-muted">N&J Intérieurs</p>
        </div>
      )}
    </Link>
  );
}

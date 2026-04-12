import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="group inline-flex items-center gap-3">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-panel transition-transform duration-300 group-hover:-translate-y-0.5',
          compact ? 'h-10 w-10' : 'h-11 w-11'
        )}
      >
        <Image src="/branding/nj-signature.svg" alt="N&J Intérieurs" fill className="object-cover object-left" priority />
      </div>
      {!compact && (
        <div className="space-y-0.5">
          <p className="text-sm font-semibold tracking-tight">N&J Desk</p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">N&J Intérieurs</p>
        </div>
      )}
    </Link>
  );
}

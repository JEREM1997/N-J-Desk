import { cn } from '@/lib/utils';

const tones = {
  default: 'border-black/5 bg-black/5 text-foreground',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  muted: 'border-zinc-200 bg-zinc-100 text-zinc-600'
};

export function Badge({
  tone = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em]',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-black/5 bg-gradient-to-b from-zinc-900 to-black px-4 py-2.5 text-sm font-medium text-white shadow-luxe transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.992] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

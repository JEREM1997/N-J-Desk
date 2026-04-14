import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'border-black/5 bg-gradient-to-b from-zinc-900 to-black text-white shadow-luxe hover:-translate-y-0.5 hover:shadow-soft focus-visible:ring-accent/20',
  secondary:
    'border-zinc-200/80 bg-white text-zinc-800 shadow-[0_1px_0_rgba(255,255,255,0.75)_inset,0_10px_24px_rgba(20,20,20,0.08)] hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:ring-zinc-200',
  ghost: 'border-transparent bg-transparent text-zinc-700 shadow-none hover:bg-black/[0.05] hover:text-zinc-900 focus-visible:ring-zinc-200',
  destructive:
    'border-rose-200 bg-rose-50 text-rose-700 shadow-none hover:-translate-y-0.5 hover:bg-rose-100 hover:text-rose-800 focus-visible:ring-rose-200'
} as const;

const sizes = {
  md: 'min-h-10 px-4 py-2.5 text-sm',
  sm: 'min-h-8 rounded-lg px-3 py-1.5 text-xs',
  lg: 'min-h-12 px-5 py-3 text-sm',
  icon: 'h-10 w-10 p-0'
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-200 active:translate-y-0 active:scale-[0.992] focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

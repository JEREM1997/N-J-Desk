import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/70 bg-panel/95 p-5 shadow-panel backdrop-blur transition-shadow duration-200 hover:shadow-soft',
        className
      )}
      {...props}
    />
  );
}

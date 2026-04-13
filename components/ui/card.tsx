import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/80 bg-panel/95 p-5 shadow-panel backdrop-blur transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}

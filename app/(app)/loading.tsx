import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLoading() {
  return (
    <section className="page-wrap">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-14" />
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-3">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </Card>
        <Card className="space-y-3">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </Card>
      </div>
    </section>
  );
}

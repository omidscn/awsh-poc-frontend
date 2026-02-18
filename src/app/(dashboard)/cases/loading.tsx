import { Skeleton } from "@/components/ui/skeleton";

export default function CasesLoading() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="mb-6 flex gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-1 rounded-xl border border-edge bg-card p-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

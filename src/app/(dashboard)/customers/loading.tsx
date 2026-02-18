import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="space-y-1 rounded-xl border border-edge bg-card p-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

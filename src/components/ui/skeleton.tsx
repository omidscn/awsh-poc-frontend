import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-[var(--sem-skeleton-from)] via-[var(--sem-skeleton-via)] to-[var(--sem-skeleton-to)] bg-[length:200%_100%] animate-shimmer",
        className
      )}
    />
  );
}

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-surface-800 via-surface-700/50 to-surface-800 bg-[length:200%_100%] animate-shimmer",
        className
      )}
    />
  );
}

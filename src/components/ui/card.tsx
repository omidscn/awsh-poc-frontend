import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-edge bg-card shadow-lg shadow-[var(--sem-shadow)]", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("border-b border-edge px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn("text-lg font-semibold text-heading", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

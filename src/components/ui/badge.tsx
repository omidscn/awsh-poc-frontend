import { cn } from "@/lib/utils";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/lib/constants";

type BadgeVariant = "status" | "priority" | "category";

const LABEL_MAP: Record<BadgeVariant, Record<string, string>> = {
  status: STATUS_LABELS,
  priority: PRIORITY_LABELS,
  category: CATEGORY_LABELS,
};

const COLOR_MAP: Record<BadgeVariant, Record<string, string>> = {
  status: STATUS_COLORS,
  priority: PRIORITY_COLORS,
  category: CATEGORY_COLORS,
};

export function Badge({
  variant,
  value,
  className,
}: {
  variant: BadgeVariant;
  value: string;
  className?: string;
}) {
  const label = LABEL_MAP[variant][value] ?? value;
  const color = COLOR_MAP[variant][value] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color,
        className
      )}
    >
      {label}
    </span>
  );
}

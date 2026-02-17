"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedRow({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      className={cn("transition-colors hover:bg-surface-800/50", className)}
      onClick={onClick}
    >
      {children}
    </motion.tr>
  );
}

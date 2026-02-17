"use client";

import { motion } from "framer-motion";

export function AnimatedTableBody({ children }: { children: React.ReactNode }) {
  return (
    <motion.tbody
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,
          },
        },
      }}
      className="divide-y divide-surface-700/50"
    >
      {children}
    </motion.tbody>
  );
}

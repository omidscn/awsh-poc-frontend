"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getInitials, getFullName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Agent } from "@/lib/types/database";

export function Topbar({ agent }: { agent: Agent }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-end border-b border-edge bg-[var(--glass-bg)] glass-blur px-6">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-xs font-medium text-white">
            {getInitials(agent.first_name, agent.last_name)}
          </div>
          <span className="text-sm font-medium text-muted">
            {getFullName(agent.first_name, agent.last_name)}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>
    </header>
  );
}

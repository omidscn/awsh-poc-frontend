"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getInitials, getFullName } from "@/lib/utils";
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
    <header className="sticky top-0 z-40 flex h-14 items-center justify-end border-b border-surface-700 bg-surface-900 px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            {getInitials(agent.first_name, agent.last_name)}
          </div>
          <span className="text-sm font-medium text-white">
            {getFullName(agent.first_name, agent.last_name)}
          </span>
        </div>
        <div className="h-4 w-px bg-surface-700" />
        <button
          onClick={handleLogout}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-200"
        >
          Abmelden
        </button>
      </div>
    </header>
  );
}

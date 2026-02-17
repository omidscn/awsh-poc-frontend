"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials, getFullName } from "@/lib/utils";
import { COMPANY_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/types/database";

export function Topbar({ agent }: { agent: Agent }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/cases")
      : pathname.startsWith(href);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            SW
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {COMPANY_NAME}
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
              isActive("/")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            Fälle
          </Link>
          <Link
            href="/customers"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
              isActive("/customers")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            Kunden
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-medium text-white">
            {getInitials(agent.first_name, agent.last_name)}
          </div>
          <span className="text-sm font-medium text-gray-700">
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

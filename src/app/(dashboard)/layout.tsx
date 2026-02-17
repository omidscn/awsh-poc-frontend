import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";
import type { Agent } from "@/lib/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("id, first_name, last_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="h-dvh bg-surface-950" style={{ height: "100dvh" }}>
      <Sidebar />
      <div className="sidebar-offset flex h-full flex-col" style={{ marginLeft: "var(--sidebar-width, 240px)" }}>
        <Topbar agent={agent as Agent} />
        <main className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-8 py-6">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
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
    <div className="flex h-screen flex-col bg-gray-50">
      <Topbar agent={agent as Agent} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

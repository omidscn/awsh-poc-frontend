import { createClient } from "@/lib/supabase/server";
import { CaseFilters } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("cases")
    .select(
      "*, customers(id, first_name, last_name, customer_number), agents(id, first_name, last_name), emails(count)"
    );

  if (params.status) query = query.eq("status", params.status);
  if (params.category) query = query.eq("category", params.category);
  if (params.priority) query = query.eq("priority", params.priority);
  if (params.agent) query = query.eq("assigned_agent_id", params.agent);

  const { data: cases } = await query.order("updated_at", { ascending: false });
  const { data: agents } = await supabase
    .from("agents")
    .select("id, first_name, last_name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Fallübersicht</h1>
      <CaseFilters agents={agents ?? []} currentFilters={params} />
      <CaseTable cases={cases ?? []} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomerInfo } from "@/components/customers/customer-info";
import { CustomerContracts } from "@/components/customers/customer-contracts";
import { CustomerCases } from "@/components/customers/customer-cases";
import { PageTransition } from "@/components/motion/page-transition";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) notFound();

  const { data: contracts } = await supabase
    .from("customer_contracts")
    .select("*")
    .eq("customer_id", id);

  const { data: cases } = await supabase
    .from("cases")
    .select("*, agents(id, first_name, last_name)")
    .eq("customer_id", id)
    .order("updated_at", { ascending: false });

  return (
    <PageTransition>
      <h1 className="mb-6 text-2xl font-bold text-surface-100">Kundenprofil</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <CustomerInfo customer={customer} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <CustomerContracts contracts={contracts ?? []} />
          <CustomerCases cases={cases ?? []} />
        </div>
      </div>
    </PageTransition>
  );
}

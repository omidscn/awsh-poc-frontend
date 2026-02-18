import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/motion/page-transition";
import { CustomerTable } from "@/components/customers/customer-table";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("*, customer_contracts(id, service_type, active), cases(count)")
    .order("last_name", { ascending: true });

  return (
    <PageTransition>
      <h1 className="mb-6 text-2xl font-bold text-heading">Kunden</h1>
      <CustomerTable customers={customers ?? []} />
    </PageTransition>
  );
}

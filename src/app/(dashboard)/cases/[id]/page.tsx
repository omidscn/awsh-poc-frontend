import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getFullName } from "@/lib/utils";
import { CaseHeader } from "@/components/case-detail/case-header";
import { CaseActions } from "@/components/case-detail/case-actions";
import { EmailThread } from "@/components/case-detail/email-thread";
import { CaseDetailClient } from "@/components/case-detail/case-detail-client";
import type { Customer, Case as CaseType } from "@/lib/types/database";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: caseData, error } = await supabase
    .from("cases")
    .select("*, customers(*), agents(id, first_name, last_name)")
    .eq("id", id)
    .single();

  if (error || !caseData) notFound();

  const { data: emails } = await supabase
    .from("emails")
    .select("*")
    .eq("case_id", id)
    .order("sent_at", { ascending: true });

  const { data: contracts } = await supabase
    .from("customer_contracts")
    .select("*")
    .eq("customer_id", caseData.customer_id);

  const { data: agents } = await supabase
    .from("agents")
    .select("id, first_name, last_name");

  const typedCase = caseData as CaseType & {
    customers: Customer;
    agents: { id: string; first_name: string; last_name: string } | null;
  };

  return (
    <CaseDetailClient
      caseId={id}
      caseSubject={typedCase.subject}
      caseCategory={typedCase.category}
      caseStatus={typedCase.status}
      casePriority={typedCase.priority}
      customerName={getFullName(
        typedCase.customers.first_name,
        typedCase.customers.last_name
      )}
      customerEmail={typedCase.customers.email}
      customer={typedCase.customers}
      contracts={contracts ?? []}
      emails={emails ?? []}
    >
      <CaseHeader caseData={typedCase} />
      <CaseActions
        caseData={typedCase}
        agents={agents ?? []}
        currentUserId={user!.id}
      />
      <EmailThread emails={emails ?? []} />
    </CaseDetailClient>
  );
}

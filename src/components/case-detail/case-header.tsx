import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Case, Customer } from "@/lib/types/database";

export function CaseHeader({
  caseData,
}: {
  caseData: Case & {
    customers: Customer;
    agents: { id: string; first_name: string; last_name: string } | null;
  };
}) {
  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zur Übersicht
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">{caseData.subject}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="status" value={caseData.status} />
        <Badge variant="priority" value={caseData.priority} />
        <Badge variant="category" value={caseData.category} />
      </div>
    </div>
  );
}

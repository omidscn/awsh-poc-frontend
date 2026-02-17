import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelative, getFullName } from "@/lib/utils";
import type { CaseWithRelations } from "@/lib/types/database";

export function CaseRow({ caseData }: { caseData: CaseWithRelations }) {
  const customerName = getFullName(
    caseData.customers.first_name,
    caseData.customers.last_name
  );

  const agentName = caseData.agents
    ? getFullName(caseData.agents.first_name, caseData.agents.last_name)
    : "—";

  const emailCount = caseData.emails?.[0]?.count ?? 0;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm">
        <Link
          href={`/cases/${caseData.id}`}
          className="font-medium text-gray-900 hover:text-brand-600"
        >
          {caseData.subject}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {customerName}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant="category" value={caseData.category} />
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant="status" value={caseData.status} />
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant="priority" value={caseData.priority} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {agentName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {formatRelative(caseData.updated_at)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
        {emailCount}
      </td>
    </tr>
  );
}

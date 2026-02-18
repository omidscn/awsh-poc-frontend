"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatRelative, getFullName } from "@/lib/utils";
import { AnimatedRow } from "./animated-row";
import type { CaseWithRelations } from "@/lib/types/database";

export function CaseRow({ caseData }: { caseData: CaseWithRelations }) {
  const router = useRouter();

  const customerName = getFullName(
    caseData.customers.first_name,
    caseData.customers.last_name
  );

  const agentName = caseData.agents
    ? getFullName(caseData.agents.first_name, caseData.agents.last_name)
    : "—";

  const emailCount = caseData.emails?.[0]?.count ?? 0;
  const href = `/cases/${caseData.id}`;

  return (
    <AnimatedRow onClick={() => router.push(href)} className="cursor-pointer">
      <td className="px-6 py-4 text-sm">
        <Link
          href={href}
          className="font-medium text-heading hover:text-brand-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {caseData.subject}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle">
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
      <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle">
        {agentName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-faint">
        {formatRelative(caseData.updated_at)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-faint">
        {emailCount}
      </td>
    </AnimatedRow>
  );
}

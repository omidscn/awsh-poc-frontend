import { CaseRow } from "./case-row";
import { EmptyState } from "@/components/ui/empty-state";
import type { CaseWithRelations } from "@/lib/types/database";

export function CaseTable({ cases }: { cases: CaseWithRelations[] }) {
  if (cases.length === 0) {
    return (
      <EmptyState
        title="Keine Fälle gefunden"
        description="Passen Sie die Filter an oder erstellen Sie einen neuen Fall."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Betreff
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Kunde
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Kategorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Priorität
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Datum
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              E-Mails
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cases.map((c) => (
            <CaseRow key={c.id} caseData={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

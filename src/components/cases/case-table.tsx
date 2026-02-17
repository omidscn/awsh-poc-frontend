import { CaseRow } from "./case-row";
import { AnimatedTableBody } from "./animated-table-body";
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
    <div className="overflow-hidden rounded-xl border border-surface-700/50 bg-surface-900">
      <table className="min-w-full divide-y divide-surface-700/50">
        <thead className="bg-surface-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Betreff
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Kunde
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Kategorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Priorität
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-400">
              Datum
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-400">
              E-Mails
            </th>
          </tr>
        </thead>
        <AnimatedTableBody>
          {cases.map((c) => (
            <CaseRow key={c.id} caseData={c} />
          ))}
        </AnimatedTableBody>
      </table>
    </div>
  );
}

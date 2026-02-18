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
    <div className="overflow-hidden rounded-xl border border-edge bg-card">
      <table className="min-w-full divide-y divide-edge">
        <thead className="bg-hover">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Betreff
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Kunde
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Kategorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Priorität
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Datum
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-subtle">
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

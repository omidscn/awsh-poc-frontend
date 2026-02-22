import Link from "next/link";
import { AnimatedTableBody } from "@/components/cases/animated-table-body";
import { AnimatedRow } from "@/components/cases/animated-row";
import { EmptyState } from "@/components/ui/empty-state";
import { getFullName, getInitials } from "@/lib/utils";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import type { CustomerWithRelations } from "@/lib/types/database";

export function CustomerTable({ customers }: { customers: CustomerWithRelations[] }) {
  if (customers.length === 0) {
    return (
      <EmptyState
        title="Keine Kunden gefunden"
        description="Es sind noch keine Kunden im System vorhanden."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-card">
      <table className="min-w-full divide-y divide-edge">
        <thead className="bg-hover">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Kunde
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Kundennummer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              E-Mail
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Ort
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle">
              Verträge
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-subtle">
              Fälle
            </th>
          </tr>
        </thead>
        <AnimatedTableBody>
          {customers.map((customer) => {
            const activeContracts = customer.customer_contracts.filter((c) => c.active);
            const caseCount = customer.cases?.[0]?.count ?? 0;

            return (
              <AnimatedRow key={customer.id}>
                <td className="px-6 py-4">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                      {getInitials(customer.first_name, customer.last_name)}
                    </div>
                    <span className="text-sm font-medium text-heading group-hover:text-brand-600 transition-colors">
                      {getFullName(customer.first_name, customer.last_name)}
                    </span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle">
                  {customer.customer_number}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle">
                  {customer.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle">
                  {customer.zip_code} {customer.city}
                </td>
                <td className="px-6 py-4">
                  {activeContracts.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeContracts.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                        >
                          {SERVICE_TYPE_LABELS[c.service_type] ?? c.service_type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-faint">Keine aktiven</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-faint">
                  {caseCount}
                </td>
              </AnimatedRow>
            );
          })}
        </AnimatedTableBody>
      </table>
    </div>
  );
}

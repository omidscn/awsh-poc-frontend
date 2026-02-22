import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SERVICE_TYPE_LABELS, PICKUP_FREQUENCY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CustomerContract } from "@/lib/types/database";

export function CustomerContracts({
  contracts,
}: {
  contracts: CustomerContract[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verträge ({contracts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <p className="text-sm text-faint">Keine Verträge vorhanden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-edge text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-subtle">
                    Service
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-subtle">
                    Größe
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-subtle">
                    Abholung
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-subtle">
                    Start
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-subtle">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-4 py-2 text-primary">
                      {SERVICE_TYPE_LABELS[contract.service_type] ??
                        contract.service_type}
                    </td>
                    <td className="px-4 py-2 text-subtle">
                      {contract.bin_size ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-subtle">
                      {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ??
                        contract.pickup_frequency}
                    </td>
                    <td className="px-4 py-2 text-subtle">
                      {formatDate(contract.start_date)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          contract.active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                        }`}
                      >
                        {contract.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

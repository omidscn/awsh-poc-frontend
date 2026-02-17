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
          <p className="text-sm text-surface-500">Keine Verträge vorhanden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-700/50 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-surface-400">
                    Service
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-surface-400">
                    Größe
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-surface-400">
                    Abholung
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-surface-400">
                    Start
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-surface-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-4 py-2 text-surface-200">
                      {SERVICE_TYPE_LABELS[contract.service_type] ??
                        contract.service_type}
                    </td>
                    <td className="px-4 py-2 text-surface-400">
                      {contract.bin_size ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-surface-400">
                      {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ??
                        contract.pickup_frequency}
                    </td>
                    <td className="px-4 py-2 text-surface-400">
                      {formatDate(contract.start_date)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          contract.active
                            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                            : "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/20"
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

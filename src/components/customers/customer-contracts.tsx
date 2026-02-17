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
          <p className="text-sm text-gray-500">Keine Verträge vorhanden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Service
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Größe
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Abholung
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Start
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-4 py-2">
                      {SERVICE_TYPE_LABELS[contract.service_type] ??
                        contract.service_type}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {contract.bin_size ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ??
                        contract.pickup_frequency}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatDate(contract.start_date)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          contract.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
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

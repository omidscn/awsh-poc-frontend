import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SERVICE_TYPE_LABELS, PICKUP_FREQUENCY_LABELS } from "@/lib/constants";
import { getFullName } from "@/lib/utils";
import type { Customer, CustomerContract } from "@/lib/types/database";

export function CustomerSidebar({
  customer,
  contracts,
}: {
  customer: Customer;
  contracts: CustomerContract[];
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Kundeninformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-500">Name</span>
            <p>
              <Link
                href={`/customers/${customer.id}`}
                className="text-brand-600 hover:underline"
              >
                {getFullName(customer.first_name, customer.last_name)}
              </Link>
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Kundennummer</span>
            <p>{customer.customer_number}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">E-Mail</span>
            <p>{customer.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Telefon</span>
            <p>{customer.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Adresse</span>
            <p>
              {customer.street}
              <br />
              {customer.zip_code} {customer.city}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verträge</CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <p className="text-sm text-gray-500">Keine Verträge vorhanden.</p>
          ) : (
            <ul className="space-y-3">
              {contracts.map((contract) => (
                <li
                  key={contract.id}
                  className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {SERVICE_TYPE_LABELS[contract.service_type] ??
                        contract.service_type}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        contract.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {contract.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                  {contract.bin_size && (
                    <p className="mt-1 text-gray-500">{contract.bin_size}</p>
                  )}
                  <p className="text-gray-500">
                    {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ??
                      contract.pickup_frequency}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

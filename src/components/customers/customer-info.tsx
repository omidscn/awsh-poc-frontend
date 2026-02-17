import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFullName, getInitials } from "@/lib/utils";
import type { Customer } from "@/lib/types/database";

export function CustomerInfo({ customer }: { customer: Customer }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-medium text-white shadow-lg shadow-brand-500/20">
            {getInitials(customer.first_name, customer.last_name)}
          </div>
          <div>
            <CardTitle>
              {getFullName(customer.first_name, customer.last_name)}
            </CardTitle>
            <p className="text-sm text-surface-400">{customer.customer_number}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-surface-500">E-Mail</span>
          <p className="text-surface-200">{customer.email}</p>
        </div>
        <div>
          <span className="font-medium text-surface-500">Telefon</span>
          <p className="text-surface-200">{customer.phone}</p>
        </div>
        <div>
          <span className="font-medium text-surface-500">Adresse</span>
          <p className="text-surface-200">
            {customer.street}
            <br />
            {customer.zip_code} {customer.city}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

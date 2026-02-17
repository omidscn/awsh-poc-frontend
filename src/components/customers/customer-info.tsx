import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFullName, getInitials } from "@/lib/utils";
import type { Customer } from "@/lib/types/database";

export function CustomerInfo({ customer }: { customer: Customer }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-medium text-white">
            {getInitials(customer.first_name, customer.last_name)}
          </div>
          <div>
            <CardTitle>
              {getFullName(customer.first_name, customer.last_name)}
            </CardTitle>
            <p className="text-sm text-gray-500">{customer.customer_number}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
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
  );
}

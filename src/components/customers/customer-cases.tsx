import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelative, getFullName } from "@/lib/utils";
import type { Case, Agent } from "@/lib/types/database";

type CaseWithAgent = Case & {
  agents: Pick<Agent, "id" | "first_name" | "last_name"> | null;
};

export function CustomerCases({ cases }: { cases: CaseWithAgent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fälle ({cases.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <p className="text-sm text-gray-500">Keine Fälle vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="block rounded-md border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {c.subject}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge variant="status" value={c.status} />
                      <Badge variant="priority" value={c.priority} />
                      <Badge variant="category" value={c.category} />
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-gray-500">
                    <p>{formatRelative(c.updated_at)}</p>
                    {c.agents && (
                      <p className="mt-1">
                        {getFullName(c.agents.first_name, c.agents.last_name)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

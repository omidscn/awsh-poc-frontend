import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/page-transition";
import { STATUS_LABELS } from "@/lib/constants";
import { formatRelative, getFullName } from "@/lib/utils";

const STATUS_ICONS: Record<string, string> = {
  open: "bg-blue-50 text-blue-600",
  in_progress: "bg-amber-50 text-amber-600",
  resolved: "bg-emerald-50 text-emerald-600",
  closed: "bg-slate-100 text-slate-500",
};

export default async function DashboardOverviewPage() {
  const supabase = await createClient();

  const [
    { count: totalCases },
    { count: totalCustomers },
    { count: openCount },
    { count: inProgressCount },
    { count: resolvedCount },
    { count: closedCount },
    { data: recentCases },
  ] = await Promise.all([
    supabase.from("cases").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "resolved"),
    supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "closed"),
    supabase
      .from("cases")
      .select("id, subject, status, priority, updated_at, customers(first_name, last_name)")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const statusCards = [
    { status: "open", count: openCount ?? 0 },
    { status: "in_progress", count: inProgressCount ?? 0 },
    { status: "resolved", count: resolvedCount ?? 0 },
    { status: "closed", count: closedCount ?? 0 },
  ];

  return (
    <PageTransition>
      <h1 className="mb-6 text-2xl font-bold text-heading">Übersicht</h1>

      {/* Status stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statusCards.map(({ status, count }) => (
          <Link key={status} href={`/cases?status=${status}`}>
            <Card className="transition-colors hover:border-subtle/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-subtle">{STATUS_LABELS[status]}</p>
                  <p className="mt-1 text-2xl font-bold text-heading">{count}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${STATUS_ICONS[status]}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-subtle">Fälle gesamt</p>
            <p className="mt-1 text-2xl font-bold text-heading">{totalCases ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-subtle">Kunden gesamt</p>
            <p className="mt-1 text-2xl font-bold text-heading">{totalCustomers ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent cases */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Letzte Fälle</CardTitle>
            <Link href="/cases" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              Alle anzeigen
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-edge">
            {recentCases?.map((c) => {
              const customer = c.customers as unknown as { first_name: string; last_name: string } | null;
              return (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-hover"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-heading">{c.subject}</p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {customer ? getFullName(customer.first_name, customer.last_name) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="status" value={c.status} />
                    <Badge variant="priority" value={c.priority} />
                    <span className="text-xs text-faint whitespace-nowrap">
                      {formatRelative(c.updated_at)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

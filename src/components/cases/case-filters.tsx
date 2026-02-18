"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from "@/lib/constants";
import { getFullName } from "@/lib/utils";
import type { Agent } from "@/lib/types/database";

export function CaseFilters({
  agents,
  currentFilters,
}: {
  agents: Pick<Agent, "id" | "first_name" | "last_name">[];
  currentFilters: { [key: string]: string | undefined };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-4 rounded-xl border border-edge bg-card p-4">
      <Select
        placeholder="Alle Status"
        value={currentFilters.status ?? ""}
        onChange={(e) => handleChange("status", e.target.value)}
        options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
          value,
          label,
        }))}
      />
      <Select
        placeholder="Alle Kategorien"
        value={currentFilters.category ?? ""}
        onChange={(e) => handleChange("category", e.target.value)}
        options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
          value,
          label,
        }))}
      />
      <Select
        placeholder="Alle Prioritäten"
        value={currentFilters.priority ?? ""}
        onChange={(e) => handleChange("priority", e.target.value)}
        options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
          value,
          label,
        }))}
      />
      <Select
        placeholder="Alle Agenten"
        value={currentFilters.agent ?? ""}
        onChange={(e) => handleChange("agent", e.target.value)}
        options={agents.map((a) => ({
          value: a.id,
          label: getFullName(a.first_name, a.last_name),
        }))}
      />
    </div>
  );
}

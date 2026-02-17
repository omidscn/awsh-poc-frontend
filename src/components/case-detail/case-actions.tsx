"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
} from "@/lib/constants";
import { getFullName } from "@/lib/utils";
import type { Agent, Case } from "@/lib/types/database";

export function CaseActions({
  caseData,
  agents,
  currentUserId,
}: {
  caseData: Case & {
    agents: Pick<Agent, "id" | "first_name" | "last_name"> | null;
  };
  agents: Pick<Agent, "id" | "first_name" | "last_name">[];
  currentUserId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleAssignToMe() {
    setLoading(true);
    await supabase
      .from("cases")
      .update({ assigned_agent_id: currentUserId, status: "in_progress" })
      .eq("id", caseData.id);
    setLoading(false);
    router.refresh();
  }

  async function handleStatusChange(status: string) {
    await supabase
      .from("cases")
      .update({ status })
      .eq("id", caseData.id);
    router.refresh();
  }

  async function handlePriorityChange(priority: string) {
    await supabase
      .from("cases")
      .update({ priority })
      .eq("id", caseData.id);
    router.refresh();
  }

  async function handleAgentChange(agentId: string) {
    await supabase
      .from("cases")
      .update({
        assigned_agent_id: agentId || null,
      })
      .eq("id", caseData.id);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4">
        {caseData.assigned_agent_id !== currentUserId && (
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={handleAssignToMe}
          >
            Mir zuweisen
          </Button>
        )}

        <Select
          label="Status"
          value={caseData.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />

        <Select
          label="Priorität"
          value={caseData.priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />

        <Select
          label="Zuständiger Agent"
          placeholder="Nicht zugewiesen"
          value={caseData.assigned_agent_id ?? ""}
          onChange={(e) => handleAgentChange(e.target.value)}
          options={agents.map((a) => ({
            value: a.id,
            label: getFullName(a.first_name, a.last_name),
          }))}
        />
      </CardContent>
    </Card>
  );
}

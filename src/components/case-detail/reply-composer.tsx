"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReplyComposer({
  caseId,
  caseSubject,
  customerEmail,
  body,
  onBodyChange,
}: {
  caseId: string;
  caseSubject: string;
  customerEmail: string;
  body: string;
  onBodyChange: (value: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: agent } = await supabase
      .from("agents")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    const fromEmail = agent
      ? `${agent.first_name.toLowerCase()}.${agent.last_name.toLowerCase()}@stadtreinigung-weber.de`
      : "service@stadtreinigung-weber.de";

    await supabase.from("emails").insert({
      case_id: caseId,
      direction: "outbound",
      from_email: fromEmail,
      to_email: customerEmail,
      subject: `Re: ${caseSubject}`,
      body: body.trim(),
      sent_at: new Date().toISOString(),
    });

    onBodyChange("");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antwort verfassen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSend} className="space-y-4">
          <Textarea
            id="reply"
            placeholder="Ihre Antwort an den Kunden..."
            rows={5}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            required
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-surface-500">
              KI-Vorschlag im Seitenpanel rechts verfügbar
            </p>
            <Button type="submit" loading={loading}>
              Senden
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

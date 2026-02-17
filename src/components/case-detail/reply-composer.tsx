"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AI_LABELS } from "@/lib/constants";

export function ReplyComposer({
  caseId,
  caseSubject,
  customerEmail,
  body,
  onBodyChange,
  onOpenAiPane,
}: {
  caseId: string;
  caseSubject: string;
  customerEmail: string;
  body: string;
  onBodyChange: (value: string) => void;
  onOpenAiPane: () => void;
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
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onOpenAiPane}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                />
              </svg>
              {AI_LABELS.triggerButton}
            </Button>
            <Button type="submit" loading={loading}>
              Senden
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

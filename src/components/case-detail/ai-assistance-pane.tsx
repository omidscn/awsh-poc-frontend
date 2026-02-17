"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AI_LABELS, CATEGORY_LABELS } from "@/lib/constants";
import type { Email, CustomerContract } from "@/lib/types/database";

type AiAssistancePaneProps = {
  caseSubject: string;
  caseCategory: string;
  caseStatus: string;
  casePriority: string;
  customerName: string;
  customerEmail: string;
  contracts: CustomerContract[];
  emails: Email[];
  onUseSuggestion: (text: string) => void;
};

export function AiAssistancePane({
  caseSubject,
  caseCategory,
  caseStatus,
  casePriority,
  customerName,
  customerEmail,
  contracts,
  emails,
  onUseSuggestion,
}: AiAssistancePaneProps) {
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsStreaming(true);
    setSuggestion("");
    setHasGenerated(true);

    const contractsSummary = contracts
      .filter((c) => c.active)
      .map((c) => `${c.service_type}${c.bin_size ? ` (${c.bin_size})` : ""} – ${c.pickup_frequency}`)
      .join(", ") || "Keine aktiven Verträge";

    const emailData = emails.map((e) => ({
      direction: e.direction,
      from_email: e.from_email,
      body: e.body,
      sent_at: e.sent_at,
    }));

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseSubject,
          caseCategory,
          caseStatus,
          casePriority,
          customerName,
          customerEmail,
          contracts: contractsSummary,
          emails: emailData,
          additionalInstructions: additionalInstructions.trim() || undefined,
        }),
      });

      if (!response.ok || !response.body) {
        setSuggestion("Fehler beim Generieren der Antwort. Bitte versuchen Sie es erneut.");
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setSuggestion(accumulated);
      }
    } catch {
      setSuggestion("Fehler beim Generieren der Antwort. Bitte versuchen Sie es erneut.");
    }

    setIsStreaming(false);
  }, [
    caseSubject,
    caseCategory,
    caseStatus,
    casePriority,
    customerName,
    customerEmail,
    contracts,
    emails,
    additionalInstructions,
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 pt-4 text-sm">
          <h4 className="font-medium text-gray-900">{AI_LABELS.contextHeading}</h4>
          <div className="space-y-1.5 text-gray-600">
            <p>
              <span className="font-medium text-gray-700">Betreff:</span>{" "}
              {caseSubject}
            </p>
            <p>
              <span className="font-medium text-gray-700">Kategorie:</span>{" "}
              {CATEGORY_LABELS[caseCategory] ?? caseCategory}
            </p>
            <p>
              <span className="font-medium text-gray-700">Kunde:</span>{" "}
              {customerName}
            </p>
            <p>
              <span className="font-medium text-gray-700">E-Mails:</span>{" "}
              {emails.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-4">
          <Textarea
            label={AI_LABELS.additionalInstructionsLabel}
            placeholder={AI_LABELS.additionalInstructionsPlaceholder}
            rows={2}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            disabled={isStreaming}
          />
          <Button
            onClick={handleGenerate}
            loading={isStreaming}
            className="w-full"
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
            {hasGenerated ? AI_LABELS.regenerateButton : AI_LABELS.generateButton}
          </Button>
        </CardContent>
      </Card>

      {(suggestion || isStreaming) && (
        <Card>
          <CardContent className="space-y-3 pt-4">
            <h4 className="text-sm font-medium text-gray-900">
              {AI_LABELS.suggestionHeading}
            </h4>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap text-gray-800">
              {suggestion}
              {isStreaming && (
                <span className="inline-block h-4 w-0.5 animate-pulse bg-gray-800" />
              )}
            </div>
            {!isStreaming && suggestion && (
              <Button
                variant="secondary"
                onClick={() => onUseSuggestion(suggestion)}
                className="w-full"
              >
                {AI_LABELS.useSuggestionButton}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

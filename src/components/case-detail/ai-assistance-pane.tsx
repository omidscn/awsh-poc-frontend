"use client";

import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { AI_LABELS, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import type { Email, CustomerContract } from "@/lib/types/database";

const DELIMITER = "---ANTWORT---";

type AiAssistancePaneProps = {
  caseSubject: string;
  caseCategory: string;
  caseStatus: string;
  casePriority: string;
  customerName: string;
  customerEmail: string;
  contracts: CustomerContract[];
  emails: Email[];
  suggestion: string;
  setSuggestion: (value: string) => void;
  reasoning: string;
  setReasoning: (value: string) => void;
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  hasGenerated: boolean;
  setHasGenerated: (value: boolean) => void;
  additionalInstructions: string;
  setAdditionalInstructions: (value: string) => void;
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
  suggestion,
  setSuggestion,
  reasoning,
  setReasoning,
  isStreaming,
  setIsStreaming,
  hasGenerated,
  setHasGenerated,
  additionalInstructions,
  setAdditionalInstructions,
  onUseSuggestion,
}: AiAssistancePaneProps) {
  const delimiterFoundRef = useRef(false);

  const handleGenerate = useCallback(async () => {
    setIsStreaming(true);
    setSuggestion("");
    setReasoning("");
    setHasGenerated(true);
    delimiterFoundRef.current = false;

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

        if (!delimiterFoundRef.current) {
          const delimiterIndex = accumulated.indexOf(DELIMITER);
          if (delimiterIndex !== -1) {
            delimiterFoundRef.current = true;
            setReasoning(accumulated.substring(0, delimiterIndex).trim());
            const afterDelimiter = accumulated.substring(delimiterIndex + DELIMITER.length).trim();
            setSuggestion(afterDelimiter);
          } else {
            setReasoning(accumulated);
          }
        } else {
          const delimiterIndex = accumulated.indexOf(DELIMITER);
          const afterDelimiter = accumulated.substring(delimiterIndex + DELIMITER.length).trim();
          setSuggestion(afterDelimiter);
        }
      }

      // Fallback if delimiter was never found — treat all as suggestion
      if (!delimiterFoundRef.current) {
        setSuggestion(accumulated.trim());
        setReasoning("");
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
    setSuggestion,
    setReasoning,
    setIsStreaming,
    setHasGenerated,
  ]);

  const isInReasoningPhase = isStreaming && !delimiterFoundRef.current;
  const isInSuggestionPhase = isStreaming && delimiterFoundRef.current;

  return (
    <div className="space-y-4">
      {/* Case context summary */}
      <div className="rounded-lg border border-ai-500/10 bg-ai-500/5 px-3 py-2.5 text-xs">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-subtle">
          <div className="col-span-2">
            <span className="text-faint">Betreff: </span>
            <span className="text-muted">{caseSubject}</span>
          </div>
          <div>
            <span className="text-faint">Kategorie: </span>
            <span className="text-muted">{CATEGORY_LABELS[caseCategory] ?? caseCategory}</span>
          </div>
          <div>
            <span className="text-faint">Status: </span>
            <span className="text-muted">{STATUS_LABELS[caseStatus] ?? caseStatus}</span>
          </div>
          <div>
            <span className="text-faint">Priorität: </span>
            <span className="text-muted">{PRIORITY_LABELS[casePriority] ?? casePriority}</span>
          </div>
          <div>
            <span className="text-faint">E-Mails: </span>
            <span className="text-muted">{emails.length}</span>
          </div>
        </div>
      </div>

      {/* Generate controls */}
      <div className="space-y-3">
        <Textarea
          label={AI_LABELS.additionalInstructionsLabel}
          placeholder={AI_LABELS.additionalInstructionsPlaceholder}
          rows={2}
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          disabled={isStreaming}
        />
        <button
          onClick={handleGenerate}
          disabled={isStreaming}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-ai-500 to-ai-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-ai-500/20 transition-all duration-150 hover:from-ai-400 hover:to-ai-500 hover:shadow-ai-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isStreaming && (
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
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
        </button>
      </div>

      {/* Reasoning card */}
      <AnimatePresence>
        {(reasoning || isInReasoningPhase) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-lg border border-ai-500/10 bg-ai-500/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-3.5 w-3.5 text-ai-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <h4 className="text-xs font-semibold text-ai-300 uppercase tracking-wide">Begründung</h4>
              </div>
              <div className="relative overflow-hidden text-xs text-subtle leading-relaxed">
                {isInReasoningPhase && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-ai-500/5 to-transparent bg-[length:200%_100%] animate-shimmer" />
                )}
                {reasoning}
                {isInReasoningPhase && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block h-3.5 w-0.5 bg-ai-400 ml-0.5"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion card */}
      <AnimatePresence>
        {(suggestion || isInSuggestionPhase) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-ai-300">
                  {AI_LABELS.suggestionHeading}
                </h4>
                <div className="relative overflow-hidden rounded-md border border-ai-500/10 bg-hover p-3 text-sm whitespace-pre-wrap text-primary">
                  {isInSuggestionPhase && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-ai-500/5 to-transparent bg-[length:200%_100%] animate-shimmer" />
                  )}
                  {suggestion}
                  {isInSuggestionPhase && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block h-4 w-0.5 bg-ai-400 ml-0.5"
                    />
                  )}
                </div>
                <AnimatePresence>
                  {!isStreaming && suggestion && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <button
                        onClick={() => onUseSuggestion(suggestion)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-ai-500/20 bg-secondary px-4 py-2 text-sm font-medium text-ai-300 transition-all duration-150 hover:bg-ai-500/10 hover:text-ai-200 active:scale-[0.98]"
                      >
                        {AI_LABELS.useSuggestionButton}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AI_LABELS, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS, SERVICE_TYPE_LABELS, PICKUP_FREQUENCY_LABELS } from "@/lib/constants";
import { EvaluateModal } from "./evaluate-modal";
import { getTemplatesForCategory, TEXTBAUSTEINE_BY_CATEGORY } from "@/lib/textbausteine";
import { formatDateTime } from "@/lib/utils";
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

type Rating = "up" | "down" | null;

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

  // Evaluate modal state
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);

  // Rating state
  const [rating, setRating] = useState<Rating>(null);
  const [ratingNote, setRatingNote] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Context inspector state
  const [showContext, setShowContext] = useState(true);
  // Template selection — defaults to all templates for the case category
  const defaultTemplateIds = () => getTemplatesForCategory(caseCategory).map((t) => t.id);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(defaultTemplateIds);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [browseCategory, setBrowseCategory] = useState<string | null>(null);

  function toggleTemplate(id: string) {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const activeContracts = contracts.filter((c) => c.active);
  const defaultCategoryTemplates = getTemplatesForCategory(caseCategory);
  // All templates currently selected (resolved objects for display)
  const selectedTemplates = Object.values(TEXTBAUSTEINE_BY_CATEGORY)
    .flat()
    .filter((t) => selectedTemplateIds.includes(t.id));
  // Templates from other categories that are selectable
  const otherCategories = Object.entries(TEXTBAUSTEINE_BY_CATEGORY).filter(
    ([cat]) => cat !== caseCategory
  );

  const handleGenerate = useCallback(async () => {
    setIsStreaming(true);
    setSuggestion("");
    setReasoning("");
    setHasGenerated(true);
    delimiterFoundRef.current = false;
    // Reset evaluation on new generation
    setRating(null);
    setRatingNote("");
    setRatingSubmitted(false);

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
          selectedTemplateIds: selectedTemplateIds.length > 0 ? selectedTemplateIds : undefined,
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
    selectedTemplateIds,
    setSuggestion,
    setReasoning,
    setIsStreaming,
    setHasGenerated,
  ]);

  const handleRatingSubmit = useCallback(() => {
    // In a real system this would persist to a database.
    // For the PoC we just mark it as submitted.
    setRatingSubmitted(true);
  }, []);

  const isInReasoningPhase = isStreaming && !delimiterFoundRef.current;
  const isInSuggestionPhase = isStreaming && delimiterFoundRef.current;

  return (
    <div className="space-y-4">
      {/* Case context summary + expandable inspector */}
      <div className="rounded-lg border border-surface-700 bg-surface-800 overflow-hidden">
        {/* Always-visible summary row */}
        <div className="px-3 py-2.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <div className="col-span-2">
              <span className="text-sm text-ai-400 font-semibold">Betreff: </span>
              <span className="text-sm text-white">{caseSubject}</span>
            </div>
            <div>
              <span className="text-sm text-ai-400 font-semibold">Kategorie: </span>
              <span className="text-sm text-white">{CATEGORY_LABELS[caseCategory] ?? caseCategory}</span>
            </div>
            <div>
              <span className="text-sm text-ai-400 font-semibold">Status: </span>
              <span className="text-sm text-white">{STATUS_LABELS[caseStatus] ?? caseStatus}</span>
            </div>
            <div>
              <span className="text-sm text-ai-400 font-semibold">Priorität: </span>
              <span className="text-sm text-white">{PRIORITY_LABELS[casePriority] ?? casePriority}</span>
            </div>
            <div>
              <span className="text-sm text-ai-400 font-semibold">E-Mails: </span>
              <span className="text-sm text-white">{emails.length}</span>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setShowContext((v) => !v)}
          className="flex w-full items-center justify-between border-t border-surface-700 px-3 py-2 text-left text-xs font-medium text-ai-400 hover:text-white transition-colors duration-150"
        >
          <span>KI-Kontext einsehen</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${showContext ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded context */}
        <AnimatePresence>
          {showContext && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-surface-700 divide-y divide-surface-700">

                {/* Customer & contracts */}
                <div className="px-3 py-2.5 space-y-1.5">
                  <p className="text-sm font-bold uppercase tracking-wide text-ai-300">Kundendaten</p>
                  <p className="text-sm font-semibold text-white">{customerName}</p>
                  <p className="text-sm text-ai-300">{customerEmail}</p>
                  {activeContracts.length > 0 ? (
                    <ul className="space-y-1 pt-0.5">
                      {activeContracts.map((c) => (
                        <li key={c.id} className="flex items-center gap-1.5 text-sm text-surface-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-ai-400 shrink-0" />
                          <span>
                            {SERVICE_TYPE_LABELS[c.service_type] ?? c.service_type}
                            {c.bin_size && <span className="text-ai-300"> {c.bin_size}</span>}
                            {" – "}
                            {PICKUP_FREQUENCY_LABELS[c.pickup_frequency] ?? c.pickup_frequency}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-surface-300 italic">Keine aktiven Verträge</p>
                  )}
                </div>

                {/* Email thread */}
                <div className="px-3 py-2.5 space-y-1.5">
                  <p className="text-sm font-bold uppercase tracking-wide text-ai-300">
                    E-Mail-Verlauf
                  </p>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-ai-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-white font-medium">{emails.length} E-Mail{emails.length !== 1 ? "s" : ""} im Kontext</span>
                  </div>
                  <div className="space-y-1 pt-0.5">
                    {emails.map((email) => {
                      const isInbound = email.direction === "inbound";
                      return (
                        <div key={email.id} className="flex items-center gap-2 text-sm text-surface-300">
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${isInbound ? "bg-ai-900 text-ai-300" : "bg-brand-900 text-brand-300"}`}>
                            {isInbound ? "Kunde" : "Agent"}
                          </span>
                          <span>{formatDateTime(email.sent_at)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Injected templates — live reflection of selection below */}
                <div className="px-3 py-2.5 space-y-1.5">
                  <p className="text-sm font-bold uppercase tracking-wide text-ai-300">
                    Injizierte Textbausteine ({selectedTemplates.length})
                  </p>
                  {selectedTemplates.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedTemplates.map((t) => (
                        <li key={t.id} className="flex items-center gap-1.5 text-sm text-surface-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-ai-400 shrink-0" />
                          {t.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-surface-300 italic">Keine Textbausteine ausgewählt</p>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Template selector */}
      <div className="rounded-lg border border-surface-700 overflow-hidden">
        <div className="px-3 py-2.5 bg-surface-800">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-semibold text-white">Textbausteine im KI-Kontext</p>
            {selectedTemplateIds.length !== defaultCategoryTemplates.length ||
             defaultCategoryTemplates.some((t) => !selectedTemplateIds.includes(t.id)) ? (
              <button
                onClick={() => {
                  setSelectedTemplateIds(defaultTemplateIds());
                  setShowMoreCategories(false);
                  setBrowseCategory(null);
                }}
                className="text-xs text-ai-400 hover:text-ai-200 transition-colors"
              >
                Zurücksetzen
              </button>
            ) : null}
          </div>

          {/* Default category templates */}
          {defaultCategoryTemplates.length === 0 ? (
            <p className="text-sm text-surface-300 italic">Keine Textbausteine für diese Kategorie hinterlegt.</p>
          ) : (
            <div className="space-y-2">
              {defaultCategoryTemplates.map((t) => {
                const checked = selectedTemplateIds.includes(t.id);
                return (
                  <label key={t.id} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTemplate(t.id)}
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-surface-600 accent-[var(--color-ai-500)] cursor-pointer"
                    />
                    <span className={`text-sm leading-snug transition-colors ${checked ? "text-white" : "text-surface-400 line-through"}`}>
                      {t.title}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Add from other categories */}
        <div className="border-t border-surface-700">
          <button
            onClick={() => {
              setShowMoreCategories((v) => !v);
              setBrowseCategory(null);
            }}
            className="flex w-full items-center justify-between px-3 py-2 text-left"
          >
            <span className="text-xs font-medium text-ai-400 hover:text-white transition-colors">
              {selectedTemplateIds.filter((id) =>
                !defaultCategoryTemplates.some((t) => t.id === id)
              ).length > 0
                ? `+ ${selectedTemplateIds.filter((id) => !defaultCategoryTemplates.some((t) => t.id === id)).length} aus anderen Kategorien`
                : "Aus anderen Kategorien hinzufügen"}
            </span>
            <svg
              className={`h-3.5 w-3.5 text-ai-400 transition-transform duration-200 ${showMoreCategories ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showMoreCategories && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden border-t border-surface-700"
              >
                <div className="px-3 py-2.5 space-y-2">
                  {/* Category pills */}
                  <div className="flex flex-wrap gap-1">
                    {otherCategories.map(([cat, catTemplates]) => {
                      const addedCount = catTemplates.filter((t) => selectedTemplateIds.includes(t.id)).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setBrowseCategory(browseCategory === cat ? null : cat)}
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium transition-all duration-150 ${
                            browseCategory === cat
                              ? "border-ai-500 bg-ai-900 text-ai-300"
                              : "border-surface-600 bg-surface-800 text-surface-200 hover:border-ai-400 hover:text-white"
                          }`}
                        >
                          {CATEGORY_LABELS[cat] ?? cat}
                          {addedCount > 0 && <span className="ml-1 text-ai-300">+{addedCount}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Templates for browsed category */}
                  <AnimatePresence>
                    {browseCategory && (
                      <motion.div
                        key={browseCategory}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.12 }}
                        className="overflow-hidden space-y-2"
                      >
                        {(TEXTBAUSTEINE_BY_CATEGORY[browseCategory] ?? []).map((t) => {
                          const checked = selectedTemplateIds.includes(t.id);
                          return (
                            <label key={t.id} className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleTemplate(t.id)}
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-surface-600 accent-[var(--color-ai-500)] cursor-pointer"
                              />
                              <span className={`text-sm leading-snug transition-colors ${checked ? "text-white" : "text-surface-400"}`}>
                                {t.title}
                              </span>
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Generate controls */}
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white">
            {AI_LABELS.additionalInstructionsLabel}
          </label>
          <textarea
            placeholder={AI_LABELS.additionalInstructionsPlaceholder}
            rows={2}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            disabled={isStreaming}
            className="block w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-white shadow-sm placeholder:text-surface-500 transition-all duration-150 focus:border-ai-500 focus:outline-none focus:ring-2 focus:ring-ai-900 resize-none disabled:opacity-50"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={isStreaming}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-ai-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-ai-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
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

          {/* Evaluate button */}
          <button
            onClick={() => setShowEvaluateModal(true)}
            disabled={isStreaming}
            title="KI zum Fall befragen und Verständnis testen"
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md border border-surface-600 bg-surface-800 px-3 py-2 text-xs font-medium text-ai-300 transition-all duration-150 hover:bg-surface-700 hover:text-ai-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Evaluieren
          </button>
        </div>
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
            <div className="rounded-lg border border-surface-700 bg-surface-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-ai-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <h4 className="text-sm font-bold text-ai-300 uppercase tracking-wide">Begründung</h4>
              </div>
              <div className="relative overflow-hidden text-sm text-surface-100 leading-relaxed">
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
            <Card className="border-surface-700 bg-surface-800 shadow-none">
              <CardContent className="space-y-3 pt-4">
                <h4 className="text-base font-semibold text-ai-300">
                  {AI_LABELS.suggestionHeading}
                </h4>
                <div className="relative overflow-hidden rounded-md border border-surface-700 bg-surface-950 p-3 text-base whitespace-pre-wrap text-white">
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
                      className="space-y-3"
                    >
                      <button
                        onClick={() => onUseSuggestion(suggestion)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-ai-500 bg-ai-900 px-4 py-2 text-sm font-semibold text-ai-200 transition-all duration-150 hover:bg-ai-800 hover:text-white active:scale-[0.98]"
                      >
                        {AI_LABELS.useSuggestionButton}
                      </button>

                      {/* Quality evaluation */}
                      <div className="rounded-lg border border-surface-700 bg-surface-950 p-3 space-y-2.5">
                        <p className="text-sm font-semibold text-white">Qualität des Vorschlags bewerten</p>
                        {!ratingSubmitted ? (
                          <>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setRating("up")}
                                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                                  rating === "up"
                                    ? "border-brand-500 bg-brand-900 text-brand-300"
                                    : "border-surface-500 bg-transparent text-surface-200 hover:border-brand-400 hover:text-brand-300"
                                }`}
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                </svg>
                                Gut
                              </button>
                              <button
                                onClick={() => setRating("down")}
                                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                                  rating === "down"
                                    ? "border-[#ef4444] bg-[#7f1d1d] text-[#fca5a5]"
                                    : "border-surface-500 bg-transparent text-surface-200 hover:border-[#f87171] hover:text-[#fca5a5]"
                                }`}
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                                </svg>
                                Verbesserungswürdig
                              </button>
                            </div>
                            <AnimatePresence>
                              {rating && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-2"
                                >
                                  <textarea
                                    placeholder={rating === "down" ? "Was hätte besser sein können? (optional)" : "Was war besonders gut? (optional)"}
                                    rows={2}
                                    value={ratingNote}
                                    onChange={(e) => setRatingNote(e.target.value)}
                                    className="w-full rounded-md border border-surface-600 bg-surface-950 px-2.5 py-1.5 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-1 focus:ring-ai-900 resize-none"
                                  />
                                  <button
                                    onClick={handleRatingSubmit}
                                    className="inline-flex w-full items-center justify-center rounded-md border border-surface-600 bg-surface-800 px-3 py-1.5 text-sm font-medium text-white transition-all duration-150 hover:bg-surface-700 active:scale-[0.98]"
                                  >
                                    Bewertung speichern
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <p className="text-sm text-brand-300 flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Bewertung gespeichert – Danke!
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evaluate modal */}
      {showEvaluateModal && (
        <EvaluateModal
          onClose={() => setShowEvaluateModal(false)}
          caseSubject={caseSubject}
          caseCategory={caseCategory}
          caseStatus={caseStatus}
          casePriority={casePriority}
          customerName={customerName}
          customerEmail={customerEmail}
          contracts={contracts}
          emails={emails}
          selectedTemplateIds={selectedTemplateIds}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AI_LABELS, SERVICE_TYPE_LABELS, PICKUP_FREQUENCY_LABELS, CATEGORY_LABELS } from "@/lib/constants";
import { getFullName, getInitials } from "@/lib/utils";
import { AiAssistancePane } from "@/components/case-detail/ai-assistance-pane";
import { TEXTBAUSTEINE_BY_CATEGORY } from "@/lib/textbausteine";
import type { Customer, Email, CustomerContract } from "@/lib/types/database";

type Tab = "kundeninfo" | "ki" | "textbausteine";

type AiSidebarProps = {
  customer: Customer;
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
  width: number;
  onWidthChange: (w: number) => void;
};

const MIN_WIDTH = 280;
const MAX_WIDTH = 680;

const TABS: { id: Tab; label: string }[] = [
  { id: "kundeninfo", label: "Kundeninfo" },
  { id: "ki", label: "KI-Assistent" },
  { id: "textbausteine", label: "Textbausteine" },
];

export function AiSidebar({
  customer,
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
  width,
  onWidthChange,
}: AiSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ki");

  // Template browser state
  const [templateCategory, setTemplateCategory] = useState(caseCategory);
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const activeContracts = contracts.filter((c) => c.active);
  const categoryTemplates = TEXTBAUSTEINE_BY_CATEGORY[templateCategory] ?? [];
  const allCategories = Object.keys(CATEGORY_LABELS) as string[];

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;

      function onMouseMove(ev: MouseEvent) {
        const delta = startX - ev.clientX;
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + delta));
        onWidthChange(newWidth);
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }

      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [width, onWidthChange]
  );

  return (
    <aside
      className="fixed right-0 top-14 bottom-0 z-30 border-l border-surface-700 bg-surface-900 flex flex-col"
      style={{ width }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize group z-10"
        title="Breite anpassen"
      >
        <div className="absolute inset-0 bg-surface-700 group-hover:bg-ai-500 transition-colors duration-150" />
      </div>

      {/* Compact customer header — always visible */}
      <div className="shrink-0 border-b border-surface-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            {getInitials(customer.first_name, customer.last_name)}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/customers/${customer.id}`}
              className="block truncate text-sm font-semibold text-white hover:text-brand-400 transition-colors"
            >
              {getFullName(customer.first_name, customer.last_name)}
            </Link>
            <p className="text-xs text-surface-400">{customer.customer_number}</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="shrink-0 flex border-b border-surface-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors duration-150 relative ${
              activeTab === tab.id
                ? "text-ai-400"
                : "text-surface-400 hover:text-surface-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ai-400" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable tab content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Kundeninfo tab ── */}
        {activeTab === "kundeninfo" && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <p className="text-surface-400 mb-0.5">E-Mail</p>
                <p className="truncate text-surface-300">{customer.email}</p>
              </div>
              <div>
                <p className="text-surface-400 mb-0.5">Telefon</p>
                <p className="text-surface-300">{customer.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-surface-400 mb-0.5">Adresse</p>
                <p className="text-surface-300">{customer.street}, {customer.zip_code} {customer.city}</p>
              </div>
            </div>

            {activeContracts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-surface-400">Aktive Verträge</p>
                <div className="space-y-1.5">
                  {activeContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between rounded-md border border-surface-700 bg-surface-800 px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-medium text-surface-200">
                        {SERVICE_TYPE_LABELS[contract.service_type] ?? contract.service_type}
                        {contract.bin_size && <span className="text-surface-400"> ({contract.bin_size})</span>}
                      </span>
                      <span className="text-surface-400">
                        {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ?? contract.pickup_frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contracts.filter((c) => !c.active).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-surface-400">Inaktive Verträge</p>
                <div className="space-y-1.5">
                  {contracts.filter((c) => !c.active).map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between rounded-md border border-surface-700 px-2.5 py-1.5 text-xs opacity-40"
                    >
                      <span className="font-medium text-surface-300">
                        {SERVICE_TYPE_LABELS[contract.service_type] ?? contract.service_type}
                        {contract.bin_size && <span className="text-surface-400"> ({contract.bin_size})</span>}
                      </span>
                      <span className="text-surface-400">
                        {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ?? contract.pickup_frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── KI-Assistent tab ── */}
        {activeTab === "ki" && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ai-400" />
              </span>
              <span className="text-sm font-semibold text-ai-400">{AI_LABELS.paneTitle}</span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-surface-400">
              Lassen Sie sich eine Antwort vorschlagen, die auf dem Fallkontext und der bisherigen Kommunikation basiert.
            </p>
            <AiAssistancePane
              caseSubject={caseSubject}
              caseCategory={caseCategory}
              caseStatus={caseStatus}
              casePriority={casePriority}
              customerName={customerName}
              customerEmail={customerEmail}
              contracts={contracts}
              emails={emails}
              suggestion={suggestion}
              setSuggestion={setSuggestion}
              reasoning={reasoning}
              setReasoning={setReasoning}
              isStreaming={isStreaming}
              setIsStreaming={setIsStreaming}
              hasGenerated={hasGenerated}
              setHasGenerated={setHasGenerated}
              additionalInstructions={additionalInstructions}
              setAdditionalInstructions={setAdditionalInstructions}
              onUseSuggestion={onUseSuggestion}
            />
          </div>
        )}

        {/* ── Textbausteine tab ── */}
        {activeTab === "textbausteine" && (
          <div className="p-4 space-y-4">
            <p className="text-xs text-surface-400 leading-relaxed">
              Wählen Sie einen Textbaustein als Grundlage für Ihre Antwort. Die Kategorie ist auf den aktuellen Fall voreingestellt.
            </p>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
              {allCategories.map((cat) => {
                const hasTemplates = (TEXTBAUSTEINE_BY_CATEGORY[cat]?.length ?? 0) > 0;
                const isActive = templateCategory === cat;
                const isCurrentCase = cat === caseCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setTemplateCategory(cat);
                      setExpandedTemplateId(null);
                    }}
                    disabled={!hasTemplates}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150 ${
                      isActive
                        ? "border-ai-700 bg-surface-700 text-ai-400"
                        : hasTemplates
                        ? "border-surface-600 bg-surface-800 text-surface-400 hover:border-ai-600 hover:text-surface-200"
                        : "border-surface-700/40 bg-transparent text-surface-600/40 cursor-not-allowed"
                    }`}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                    {isCurrentCase && (
                      <span className="ml-1 opacity-60">●</span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-surface-600">● = Kategorie dieses Falls</p>

            {/* Template list */}
            {categoryTemplates.length === 0 ? (
              <p className="text-xs text-surface-400 italic">Keine Textbausteine für diese Kategorie hinterlegt.</p>
            ) : (
              <div className="space-y-2">
                {categoryTemplates.map((template) => {
                  const isExpanded = expandedTemplateId === template.id;
                  return (
                    <div
                      key={template.id}
                      className="rounded-lg border border-surface-700 overflow-hidden"
                    >
                      {/* Header row */}
                      <button
                        onClick={() => setExpandedTemplateId(isExpanded ? null : template.id)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-surface-800 transition-colors duration-150"
                      >
                        <span className="text-xs font-medium text-surface-200 pr-2">{template.title}</span>
                        <svg
                          className={`h-3.5 w-3.5 shrink-0 text-surface-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="border-t border-surface-700">
                          <div className="max-h-64 overflow-y-auto px-3 py-2.5">
                            <p className="text-xs text-surface-300 whitespace-pre-wrap leading-relaxed">
                              {template.content}
                            </p>
                          </div>
                          <div className="border-t border-surface-700 px-3 py-2">
                            <button
                              onClick={() => {
                                onUseSuggestion(template.content);
                                setExpandedTemplateId(null);
                              }}
                              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-ai-700 bg-surface-700 px-3 py-1.5 text-xs font-medium text-ai-400 transition-all duration-150 hover:bg-surface-600 hover:text-ai-300 active:scale-[0.98]"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              In Antwortfeld übernehmen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </aside>
  );
}

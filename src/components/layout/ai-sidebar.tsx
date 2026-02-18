"use client";

import Link from "next/link";
import { AI_LABELS, SERVICE_TYPE_LABELS, PICKUP_FREQUENCY_LABELS } from "@/lib/constants";
import { getFullName, getInitials } from "@/lib/utils";
import { AiAssistancePane } from "@/components/case-detail/ai-assistance-pane";
import type { Customer, Email, CustomerContract } from "@/lib/types/database";

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
};

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
}: AiSidebarProps) {
  const activeContracts = contracts.filter((c) => c.active);

  return (
    <aside
      className="fixed right-0 top-14 bottom-0 z-30 w-96 border-l border-edge bg-[var(--glass-bg)] backdrop-blur-xl"
    >
      {/* Animated gradient glow on left edge */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-ai-500/40 via-ai-400/20 to-ai-500/40 animate-glow-pulse" />

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto">
        {/* Customer section */}
        <div className="border-b border-edge px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-medium text-white">
              {getInitials(customer.first_name, customer.last_name)}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/customers/${customer.id}`}
                className="block truncate text-sm font-semibold text-heading hover:text-brand-400 transition-colors"
              >
                {getFullName(customer.first_name, customer.last_name)}
              </Link>
              <p className="text-xs text-faint">{customer.customer_number}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <span className="text-faint">E-Mail</span>
              <p className="truncate text-muted">{customer.email}</p>
            </div>
            <div>
              <span className="text-faint">Telefon</span>
              <p className="text-muted">{customer.phone}</p>
            </div>
            <div className="col-span-2">
              <span className="text-faint">Adresse</span>
              <p className="text-muted">{customer.street}, {customer.zip_code} {customer.city}</p>
            </div>
          </div>
          {activeContracts.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <span className="text-xs font-medium text-faint">Aktive Verträge</span>
              {activeContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between rounded-md border border-edge bg-hover px-2.5 py-1.5 text-xs"
                >
                  <span className="font-medium text-muted">
                    {SERVICE_TYPE_LABELS[contract.service_type] ?? contract.service_type}
                    {contract.bin_size && <span className="text-faint"> ({contract.bin_size})</span>}
                  </span>
                  <span className="text-faint">
                    {PICKUP_FREQUENCY_LABELS[contract.pickup_frequency] ?? contract.pickup_frequency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI header + description */}
        <div className="border-b border-edge px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ai-500" />
            </span>
            <span className="text-sm font-semibold text-ai-300 dark:text-ai-300">
              {AI_LABELS.paneTitle}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-faint">
            Lassen Sie sich eine Antwort vorschlagen, die auf dem Fallkontext und der bisherigen Kommunikation basiert. Optional können Sie Zusatzhinweise eingeben, um die Antwort anzupassen.
          </p>
        </div>

        {/* AI pane content */}
        <div className="p-4">
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
      </div>
    </aside>
  );
}

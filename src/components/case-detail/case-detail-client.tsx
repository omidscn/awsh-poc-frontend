"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AI_LABELS } from "@/lib/constants";
import { ReplyComposer } from "./reply-composer";
import { CustomerSidebar } from "./customer-sidebar";
import { AiAssistancePane } from "./ai-assistance-pane";
import type { Customer, CustomerContract, Email } from "@/lib/types/database";

type ActiveTab = "customer" | "ai";

type CaseDetailClientProps = {
  children: React.ReactNode;
  caseId: string;
  caseSubject: string;
  caseCategory: string;
  caseStatus: string;
  casePriority: string;
  customerName: string;
  customerEmail: string;
  customer: Customer;
  contracts: CustomerContract[];
  emails: Email[];
};

export function CaseDetailClient({
  children,
  caseId,
  caseSubject,
  caseCategory,
  caseStatus,
  casePriority,
  customerName,
  customerEmail,
  customer,
  contracts,
  emails,
}: CaseDetailClientProps) {
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("customer");

  function handleOpenAiPane() {
    setActiveTab("ai");
  }

  function handleUseSuggestion(text: string) {
    setBody(text);
    setActiveTab("customer");
  }

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        {children}
        <ReplyComposer
          caseId={caseId}
          caseSubject={caseSubject}
          customerEmail={customerEmail}
          body={body}
          onBodyChange={setBody}
          onOpenAiPane={handleOpenAiPane}
        />
      </div>
      <div className="w-96 shrink-0 space-y-4">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("customer")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "customer"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {AI_LABELS.tabCustomer}
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "ai"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {AI_LABELS.tabAi}
          </button>
        </div>

        {activeTab === "customer" ? (
          <CustomerSidebar customer={customer} contracts={contracts} />
        ) : (
          <AiAssistancePane
            caseSubject={caseSubject}
            caseCategory={caseCategory}
            caseStatus={caseStatus}
            casePriority={casePriority}
            customerName={customerName}
            customerEmail={customerEmail}
            contracts={contracts}
            emails={emails}
            onUseSuggestion={handleUseSuggestion}
          />
        )}
      </div>
    </div>
  );
}

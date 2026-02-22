"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ReplyComposer } from "./reply-composer";
import { AiSidebar } from "@/components/layout/ai-sidebar";
import type { Customer, CustomerContract, Email } from "@/lib/types/database";

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 680;

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

  // Lifted AI state — persists across renders
  const [suggestion, setSuggestion] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [mounted, setMounted] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(480);

  useEffect(() => {
    setMounted(true);
    setSidebarWidth(
      Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, Math.round(window.innerWidth / 3)))
    );
  }, []);

  function handleUseSuggestion(text: string) {
    setBody(text);
  }

  return (
    <>
      <div className="space-y-6" style={{ marginRight: sidebarWidth }}>
        {children}
        <ReplyComposer
          caseId={caseId}
          caseSubject={caseSubject}
          customerEmail={customerEmail}
          body={body}
          onBodyChange={setBody}
        />
      </div>
      {mounted &&
        createPortal(
          <AiSidebar
            customer={customer}
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
            onUseSuggestion={handleUseSuggestion}
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
          />,
          document.body
        )}
    </>
  );
}

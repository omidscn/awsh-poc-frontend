"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Email, CustomerContract } from "@/lib/types/database";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type EvaluateModalProps = {
  onClose: () => void;
  caseSubject: string;
  caseCategory: string;
  caseStatus: string;
  casePriority: string;
  customerName: string;
  customerEmail: string;
  contracts: CustomerContract[];
  emails: Email[];
  selectedTemplateIds: string[];
};

const SUGGESTED_QUESTIONS = [
  "Was ist das Hauptanliegen des Kunden?",
  "Welchen Textbaustein würdest du wählen und warum?",
  "Welche Details aus den E-Mails sind besonders relevant?",
  "Wie dringend ist dieser Fall und warum?",
];

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Ich habe den Fallkontext geladen und bin bereit für Ihre Fragen. Sie können mich zum Beispiel fragen, wie ich die Kundensituation einschätze, welchen Textbaustein ich wählen würde, oder wie ich die Priorität begründe.",
};

export function EvaluateModal({
  onClose,
  caseSubject,
  caseCategory,
  caseStatus,
  casePriority,
  customerName,
  customerEmail,
  contracts,
  emails,
  selectedTemplateIds,
}: EvaluateModalProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMessage: Message = { role: "user", content: content.trim() };
      // All messages to send as history (excluding the initial assistant greeting
      // since it's not from the API — it's client-side UI only)
      const historyToSend = [...messages.slice(1), userMessage];

      setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
      setInput("");
      setIsStreaming(true);

      const contractsSummary =
        contracts
          .filter((c) => c.active)
          .map(
            (c) =>
              `${c.service_type}${c.bin_size ? ` (${c.bin_size})` : ""} – ${c.pickup_frequency}`
          )
          .join(", ") || "Keine aktiven Verträge";

      try {
        const response = await fetch("/api/ai/evaluate", {
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
            emails: emails.map((e) => ({
              direction: e.direction,
              from_email: e.from_email,
              body: e.body,
              sent_at: e.sent_at,
            })),
            selectedTemplateIds,
            messages: historyToSend,
          }),
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text().catch(() => "");
          console.error("[EvaluateModal] HTTP", response.status, errorText);
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: `Fehler ${response.status}: ${errorText || "Bitte versuchen Sie es erneut."}` },
          ]);
          setIsStreaming(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              { role: "assistant", content: last.content + text },
            ];
          });
        }
      } catch (err) {
        console.error("[EvaluateModal] Fetch error:", err);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: "Netzwerkfehler. Bitte versuchen Sie es erneut." },
        ]);
      }

      setIsStreaming(false);
      inputRef.current?.focus();
    },
    [
      messages,
      isStreaming,
      caseSubject,
      caseCategory,
      caseStatus,
      casePriority,
      customerName,
      customerEmail,
      contracts,
      emails,
      selectedTemplateIds,
    ]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const modal = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 flex w-full max-w-2xl flex-col rounded-xl border border-edge bg-card shadow-2xl"
          style={{ height: "80vh", maxHeight: "700px" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-edge px-5 py-4 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ai-500" />
                </span>
                <h2 className="text-sm font-semibold text-ai-700">KI-Evaluation</h2>
              </div>
              <p className="text-xs text-faint truncate max-w-md">{caseSubject}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 rounded-md p-1 text-faint hover:bg-hover hover:text-muted transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Context badge strip */}
          <div className="flex items-center gap-2 border-b border-edge px-5 py-2 shrink-0 overflow-x-auto">
            <span className="text-[10px] text-faint shrink-0">Kontext:</span>
            {[
              customerName,
              caseCategory,
              `${selectedTemplateIds.length} Textbaustein${selectedTemplateIds.length !== 1 ? "e" : ""}`,
              `${emails.length} E-Mail${emails.length !== 1 ? "s" : ""}`,
            ].map((label) => (
              <span
                key={label}
                className="shrink-0 rounded-full bg-ai-50 px-2 py-0.5 text-[10px] font-medium text-ai-700 ring-1 ring-ai-200"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                    msg.role === "assistant"
                      ? "bg-ai-100 text-ai-700"
                      : "bg-brand-100 text-brand-700"
                  }`}
                >
                  {msg.role === "assistant" ? "KI" : "AG"}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-secondary text-primary rounded-tl-sm"
                      : "bg-ai-50 text-primary rounded-tr-sm ring-1 ring-ai-200"
                  }`}
                >
                  {msg.content === "" && isStreaming && i === messages.length - 1 ? (
                    <span className="flex items-center gap-1 text-faint text-xs">
                      <span className="inline-flex gap-0.5">
                        {[0, 1, 2].map((dot) => (
                          <motion.span
                            key={dot}
                            className="block h-1.5 w-1.5 rounded-full bg-ai-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: dot * 0.2,
                            }}
                          />
                        ))}
                      </span>
                    </span>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions — shown only before agent sends first message */}
          <AnimatePresence>
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="shrink-0 border-t border-edge px-5 py-3 overflow-hidden"
              >
                <p className="text-[10px] text-faint mb-2">Schnellfragen:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={isStreaming}
                      className="rounded-full border border-ai-200 bg-ai-50 px-2.5 py-1 text-[11px] text-ai-700 transition-all duration-150 hover:bg-ai-100 hover:text-ai-800 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="shrink-0 border-t border-edge px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Frage stellen… (Enter zum Senden, Shift+Enter für Zeilenumbruch)"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none rounded-lg border border-edge bg-hover px-3 py-2 text-sm text-primary placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-ai-500/40 disabled:opacity-50 min-h-[38px] max-h-28 overflow-y-auto"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-ai-600 text-white shadow-sm transition-all duration-150 hover:bg-ai-700 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              >
                {isStreaming ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-faint text-center">
              Die KI antwortet basierend auf dem Fallkontext und den ausgewählten Textbausteinen
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

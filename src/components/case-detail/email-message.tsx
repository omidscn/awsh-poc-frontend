import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import type { Email } from "@/lib/types/database";

export function EmailMessage({ email }: { email: Email }) {
  const isInbound = email.direction === "inbound";

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isInbound
          ? "border-surface-700/50 bg-surface-800/50 border-l-4 border-l-surface-500"
          : "border-brand-500/20 bg-brand-500/5 border-l-4 border-l-brand-500"
      )}
    >
      <div className="mb-2 flex items-center justify-between text-xs text-surface-500">
        <span>
          {isInbound ? "Von" : "An"}:{" "}
          <span className="font-medium text-surface-300">
            {isInbound ? email.from_email : email.to_email}
          </span>
        </span>
        <span>{formatDateTime(email.sent_at)}</span>
      </div>
      {email.subject && (
        <p className="mb-2 text-sm font-medium text-surface-200">
          {email.subject}
        </p>
      )}
      <div className="whitespace-pre-wrap text-sm text-surface-300">
        {email.body}
      </div>
    </div>
  );
}

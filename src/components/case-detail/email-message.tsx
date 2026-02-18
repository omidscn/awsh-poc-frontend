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
          ? "border-edge bg-[var(--sem-inbound-bg)] border-l-4 border-l-[var(--sem-inbound-border)]"
          : "border-brand-500/20 bg-brand-500/5 border-l-4 border-l-brand-500"
      )}
    >
      <div className="mb-2 flex items-center justify-between text-xs text-faint">
        <span>
          {isInbound ? "Von" : "An"}:{" "}
          <span className="font-medium text-muted">
            {isInbound ? email.from_email : email.to_email}
          </span>
        </span>
        <span>{formatDateTime(email.sent_at)}</span>
      </div>
      {email.subject && (
        <p className="mb-2 text-sm font-medium text-primary">
          {email.subject}
        </p>
      )}
      <div className="whitespace-pre-wrap text-sm text-muted">
        {email.body}
      </div>
    </div>
  );
}

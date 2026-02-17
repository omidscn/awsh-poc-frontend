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
          ? "border-gray-200 bg-gray-50 border-l-4 border-l-gray-400"
          : "border-blue-200 bg-blue-50 border-l-4 border-l-blue-400"
      )}
    >
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isInbound ? "Von" : "An"}:{" "}
          <span className="font-medium text-gray-700">
            {isInbound ? email.from_email : email.to_email}
          </span>
        </span>
        <span>{formatDateTime(email.sent_at)}</span>
      </div>
      {email.subject && (
        <p className="mb-2 text-sm font-medium text-gray-800">
          {email.subject}
        </p>
      )}
      <div className="whitespace-pre-wrap text-sm text-gray-700">
        {email.body}
      </div>
    </div>
  );
}

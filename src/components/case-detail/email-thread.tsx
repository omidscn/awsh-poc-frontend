import { EmailMessage } from "./email-message";
import type { Email } from "@/lib/types/database";

export function EmailThread({ emails }: { emails: Email[] }) {
  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-surface-700/50 bg-surface-900 p-6 text-center text-sm text-surface-400">
        Noch keine E-Mails vorhanden.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-surface-100">
        E-Mail-Verlauf ({emails.length})
      </h2>
      <div className="space-y-3">
        {emails.map((email) => (
          <EmailMessage key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
}

import { EmailMessage } from "./email-message";
import type { Email } from "@/lib/types/database";

export function EmailThread({ emails }: { emails: Email[] }) {
  if (emails.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        Noch keine E-Mails vorhanden.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
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

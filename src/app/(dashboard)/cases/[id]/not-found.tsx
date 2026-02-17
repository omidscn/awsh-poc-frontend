import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CaseNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-bold text-surface-100">Fall nicht gefunden</h2>
      <p className="mt-2 text-surface-400">
        Der angeforderte Fall existiert nicht oder wurde gelöscht.
      </p>
      <Link href="/cases" className="mt-6">
        <Button variant="secondary">Zurück zur Übersicht</Button>
      </Link>
    </div>
  );
}

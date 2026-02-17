"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-gray-900">
        Ein Fehler ist aufgetreten
      </h2>
      <p className="mt-2 text-gray-600">
        {error.message || "Bitte versuchen Sie es erneut."}
      </p>
      <Button variant="secondary" className="mt-6" onClick={reset}>
        Erneut versuchen
      </Button>
    </div>
  );
}

import { Spinner } from "@/components/ui/spinner";

export default function CaseDetailLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="h-8 w-8 text-brand-600" />
    </div>
  );
}

import { LoginForm } from "@/components/auth/login-form";
import { COMPANY_NAME } from "@/lib/constants";
import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <LoginCard>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-500/20">
            SW
          </div>
          <h1 className="text-2xl font-bold text-heading">{COMPANY_NAME}</h1>
          <p className="mt-2 text-subtle">Agent Dashboard</p>
        </div>
        <LoginForm />
      </LoginCard>
    </div>
  );
}

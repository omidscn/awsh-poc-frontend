import { LoginForm } from "@/components/auth/login-form";
import { COMPANY_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            SW
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{COMPANY_NAME}</h1>
          <p className="mt-2 text-gray-600">Agent Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

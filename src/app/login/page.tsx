import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/votantes");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-800 to-brand-500 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold">
            400
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Lista 400</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de votantes y actividades
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

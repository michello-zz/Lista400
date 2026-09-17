import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.rol !== "ADMINISTRADOR") redirect("/votantes");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar nombre={session.user.name || ""} rol={session.user.rol || ""} />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

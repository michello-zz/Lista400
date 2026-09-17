import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UsuariosListado from "@/components/UsuariosListado";

export default async function UsuariosPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Usuarios del sistema</h1>
      <UsuariosListado idPropio={session?.user.id} />
    </div>
  );
}

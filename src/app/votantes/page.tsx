import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { puedeEditarVotantes } from "@/lib/roles";
import VotantesListado from "@/components/VotantesListado";

export default async function VotantesPage() {
  const session = await getServerSession(authOptions);
  const puedeEditar = puedeEditarVotantes(session?.user.rol);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Votantes</h1>
      <VotantesListado puedeEditar={puedeEditar} />
    </div>
  );
}

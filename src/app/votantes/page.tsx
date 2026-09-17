import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { puedeEditarVotantes } from "@/lib/roles";
import VotantesListado from "@/components/VotantesListado";

export default async function VotantesPage() {
  const session = await getServerSession(authOptions);
  const puedeEditar = puedeEditarVotantes(session?.user.rol);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Votantes</h1>
        <a
          href="/api/votantes/exportar"
          download
          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Descargar Excel
        </a>
      </div>
      <VotantesListado puedeEditar={puedeEditar} />
    </div>
  );
}

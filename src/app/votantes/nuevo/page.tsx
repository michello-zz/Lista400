import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { puedeEditarVotantes } from "@/lib/roles";
import VotanteForm from "@/components/VotanteForm";

export default async function NuevoVotantePage() {
  const session = await getServerSession(authOptions);
  if (!puedeEditarVotantes(session?.user.rol)) {
    redirect("/votantes");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Nuevo votante</h1>
      <VotanteForm />
    </div>
  );
}

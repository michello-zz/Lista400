import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { puedeEditarVotantes } from "@/lib/roles";
import VotanteForm from "@/components/VotanteForm";
import VotanteVista from "@/components/VotanteVista";
import { Votante } from "@/types";

export default async function VotantePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const votanteDb = await prisma.votante.findUnique({ where: { id: params.id } });

  if (!votanteDb) {
    notFound();
  }

  const votante: Votante = {
    ...votanteDb,
    createdAt: votanteDb.createdAt.toISOString(),
    updatedAt: votanteDb.updatedAt.toISOString(),
  };

  const puedeEditar = puedeEditarVotantes(session?.user.rol);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        {puedeEditar ? "Editar votante" : "Datos del votante"}
      </h1>
      {puedeEditar ? <VotanteForm votante={votante} /> : <VotanteVista votante={votante} />}
    </div>
  );
}

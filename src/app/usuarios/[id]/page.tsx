import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UsuarioForm from "@/components/UsuarioForm";
import { Usuario } from "@/types";

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const usuarioDb = await prisma.usuario.findUnique({
    where: { id: params.id },
    select: { id: true, nombre: true, correo: true, rol: true, activo: true, createdAt: true },
  });

  if (!usuarioDb) {
    notFound();
  }

  const usuario: Usuario = {
    ...usuarioDb,
    createdAt: usuarioDb.createdAt.toISOString(),
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Editar usuario</h1>
      <UsuarioForm usuario={usuario} />
    </div>
  );
}

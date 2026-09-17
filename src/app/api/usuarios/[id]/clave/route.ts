import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { puedeGestionarUsuarios } from "@/lib/roles";

type Params = { params: { id: string } };

// PUT /api/usuarios/[id]/clave -> restablecer la clave de un usuario
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeGestionarUsuarios(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { clave } = await req.json();

  if (!clave || clave.length < 6) {
    return NextResponse.json(
      { error: "La clave debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }

  const claveHash = await bcrypt.hash(clave, 10);

  try {
    await prisma.usuario.update({
      where: { id: params.id },
      data: { clave: claveHash },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
}

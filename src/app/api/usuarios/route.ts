import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { puedeGestionarUsuarios, ROLES } from "@/lib/roles";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !puedeGestionarUsuarios(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(usuarios);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeGestionarUsuarios(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nombre, correo, clave, rol } = body;

  if (!nombre || !correo || !clave || !rol) {
    return NextResponse.json(
      { error: "Nombre, correo, clave y rol son obligatorios" },
      { status: 400 }
    );
  }

  if (!ROLES.includes(rol)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  if (clave.length < 6) {
    return NextResponse.json(
      { error: "La clave debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }

  const correoNormalizado = correo.toLowerCase().trim();

  const existente = await prisma.usuario.findUnique({ where: { correo: correoNormalizado } });
  if (existente) {
    return NextResponse.json(
      { error: "Ya existe un usuario con ese correo" },
      { status: 409 }
    );
  }

  const claveHash = await bcrypt.hash(clave, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      correo: correoNormalizado,
      clave: claveHash,
      rol,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });

  return NextResponse.json(usuario, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { puedeGestionarUsuarios, ROLES } from "@/lib/roles";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeGestionarUsuarios(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: params.id },
    select: { id: true, nombre: true, correo: true, rol: true, activo: true, createdAt: true },
  });

  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json(usuario);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeGestionarUsuarios(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nombre, correo, rol, activo } = body;

  if (!nombre || !correo || !rol) {
    return NextResponse.json(
      { error: "Nombre, correo y rol son obligatorios" },
      { status: 400 }
    );
  }

  if (!ROLES.includes(rol)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  // Evitar que el administrador se quite a sí mismo el rol de administrador
  // si es el único administrador activo del sistema.
  if (session.user.id === params.id && rol !== "ADMINISTRADOR") {
    const otrosAdmins = await prisma.usuario.count({
      where: { rol: "ADMINISTRADOR", activo: true, NOT: { id: params.id } },
    });
    if (otrosAdmins === 0) {
      return NextResponse.json(
        { error: "No podés quitarte el rol de Administrador: sos el único activo." },
        { status: 400 }
      );
    }
  }

  const correoNormalizado = correo.toLowerCase().trim();

  const conflicto = await prisma.usuario.findFirst({
    where: { correo: correoNormalizado, NOT: { id: params.id } },
  });
  if (conflicto) {
    return NextResponse.json(
      { error: "Ya existe otro usuario con ese correo" },
      { status: 409 }
    );
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id: params.id },
      data: {
        nombre,
        correo: correoNormalizado,
        rol,
        activo: activo !== undefined ? Boolean(activo) : undefined,
      },
      select: { id: true, nombre: true, correo: true, rol: true, activo: true, createdAt: true },
    });
    return NextResponse.json(usuario);
  } catch {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeGestionarUsuarios(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "No podés eliminar tu propio usuario mientras tenés la sesión abierta." },
      { status: 400 }
    );
  }

  try {
    await prisma.usuario.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
}

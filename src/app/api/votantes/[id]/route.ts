import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { puedeEditarVotantes, puedeVerVotantes } from "@/lib/roles";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeVerVotantes(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const votante = await prisma.votante.findUnique({ where: { id: params.id } });
  if (!votante) {
    return NextResponse.json({ error: "Votante no encontrado" }, { status: 404 });
  }

  return NextResponse.json(votante);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeEditarVotantes(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { credencial, nombre, apellido, direccion, telefono, gpsLat, gpsLng, observaciones } = body;

  if (!credencial || !nombre || !apellido) {
    return NextResponse.json(
      { error: "Credencial, nombre y apellido son obligatorios" },
      { status: 400 }
    );
  }

  // Verificar que la credencial no esté en uso por otro votante
  const conflicto = await prisma.votante.findFirst({
    where: { credencial, NOT: { id: params.id } },
  });
  if (conflicto) {
    return NextResponse.json(
      { error: "Ya existe otro votante con esa credencial" },
      { status: 409 }
    );
  }

  try {
    const votante = await prisma.votante.update({
      where: { id: params.id },
      data: {
        credencial,
        nombre,
        apellido,
        direccion: direccion || null,
        telefono: telefono || null,
        gpsLat: gpsLat !== undefined && gpsLat !== "" ? parseFloat(gpsLat) : null,
        gpsLng: gpsLng !== undefined && gpsLng !== "" ? parseFloat(gpsLng) : null,
        observaciones: observaciones || null,
      },
    });
    return NextResponse.json(votante);
  } catch {
    return NextResponse.json({ error: "Votante no encontrado" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeEditarVotantes(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.votante.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Votante no encontrado" }, { status: 404 });
  }
}

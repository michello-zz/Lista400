import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { puedeEditarVotantes, puedeVerVotantes } from "@/lib/roles";

// GET /api/votantes?q=texto  -> listar (con búsqueda opcional)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !puedeVerVotantes(session.user.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();

  const votantes = await prisma.votante.findMany({
    where: q
      ? {
          OR: [
            { credencial: { contains: q, mode: "insensitive" } },
            { nombre: { contains: q, mode: "insensitive" } },
            { apellido: { contains: q, mode: "insensitive" } },
            { direccion: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { apellido: "asc" },
  });

  return NextResponse.json(votantes);
}

// POST /api/votantes -> crear un nuevo votante
export async function POST(req: NextRequest) {
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

  const existente = await prisma.votante.findUnique({ where: { credencial } });
  if (existente) {
    return NextResponse.json(
      { error: "Ya existe un votante con esa credencial" },
      { status: 409 }
    );
  }

  const votante = await prisma.votante.create({
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

  return NextResponse.json(votante, { status: 201 });
}

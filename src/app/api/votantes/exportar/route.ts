// src/app/api/votantes/exportar/route.ts
//
// Genera un archivo Excel (.xlsx) con todos los votantes y lo devuelve
// como descarga. Reutiliza la misma protección de sesión/rol que ya
// tenga tu middleware.ts para las rutas /api/votantes/*.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function GET() {
  const votantes = await prisma.votante.findMany({
    orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
  });

  const filas = votantes.map((v) => ({
    Credencial: v.credencial,
    Nombre: v.nombre,
    Apellido: v.apellido,
    Direccion: v.direccion ?? "",
    Telefono: v.telefono ?? "",
    Latitud: v.gpsLat ?? "",
    Longitud: v.gpsLng ?? "",
    Observaciones: v.observaciones ?? "",
  }));

  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Votantes");

  const buffer = XLSX.write(libro, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="votantes.xlsx"',
    },
  });
}

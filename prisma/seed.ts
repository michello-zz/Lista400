// Script de siembra: crea el usuario Administrador inicial.
// Ejecutar con: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const nombre = process.env.SEED_ADMIN_NOMBRE || "Administrador";
  const correo = process.env.SEED_ADMIN_CORREO || "admin@lista400.com";
  const claveTexto = process.env.SEED_ADMIN_CLAVE || "CambiarEstaClave123";

  const existente = await prisma.usuario.findUnique({ where: { correo } });
  if (existente) {
    console.log(`Ya existe un usuario con el correo ${correo}. No se crea de nuevo.`);
    return;
  }

  const clave = await bcrypt.hash(claveTexto, 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      clave,
      rol: "ADMINISTRADOR",
      activo: true,
    },
  });

  console.log("Usuario administrador creado:");
  console.log(`  Correo: ${admin.correo}`);
  console.log(`  Clave inicial: ${claveTexto}`);
  console.log("IMPORTANTE: cambiá esta clave luego de iniciar sesión por primera vez.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

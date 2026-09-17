# Lista 400 — Gestión de Votantes

Sistema web para gestionar votantes y sus actividades. Incluye login con roles
(Administrador, Operador, Consulta), gestión de usuarios, gestión de votantes
y un mapa interactivo con la ubicación GPS de cada votante.

## Tecnologías

- **Next.js 14** (App Router) + TypeScript
- **Prisma** + **Postgres** (Vercel Postgres / Neon)
- **NextAuth (Auth.js)** para login y sesiones con roles
- **Leaflet + OpenStreetMap** para el mapa (sin costo, sin API key)
- **Tailwind CSS** para los estilos

## Roles

| Rol | Permisos |
|---|---|
| Administrador | Todo: gestiona votantes y usuarios del sistema |
| Operador | Ingresar, modificar, eliminar y listar votantes |
| Consulta | Solo puede visualizar los datos de votantes |

## 1. Requisitos previos

- Cuenta en [Vercel](https://vercel.com/) (gratuita para empezar)
- Cuenta en GitHub (para subir el código y conectarlo con Vercel)
- Node.js 18+ instalado si querés probarlo en tu computadora antes de desplegar

## 2. Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar el archivo de variables de entorno
cp .env.example .env

# 3. Completar .env con los datos de tu base de datos Postgres
#    (podés crear una gratis en https://neon.tech o usar Vercel Postgres)

# 4. Crear las tablas en la base de datos
npm run db:push

# 5. Crear el usuario Administrador inicial
npm run db:seed

# 6. Iniciar el servidor de desarrollo
npm run dev
```

Abrí http://localhost:3000 e iniciá sesión con el correo y clave que definiste
en `SEED_ADMIN_CORREO` / `SEED_ADMIN_CLAVE` dentro de `.env`.

## 3. Desplegar en Vercel

1. Subí este proyecto a un repositorio de GitHub.
2. En Vercel, hacé click en **Add New → Project** e importá el repositorio.
3. Antes de desplegar, en la pestaña **Storage** del proyecto en Vercel, creá
   una base de datos **Postgres** (Neon). Vercel agrega automáticamente las
   variables `POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING` al proyecto.
4. En **Settings → Environment Variables**, agregá además:
   - `NEXTAUTH_SECRET`: un valor aleatorio largo (podés generarlo con
     `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: la URL pública de tu sitio, por ejemplo
     `https://lista400.vercel.app`
5. Desplegá el proyecto.
6. Una vez desplegado, ejecutá la migración y el seed contra la base de datos
   de producción. La forma más simple es hacerlo desde tu computadora,
   apuntando temporalmente tu `.env` local a la base de datos de producción
   (copiá las variables desde Vercel):
   ```bash
   npm run db:push
   npm run db:seed
   ```
7. Entrá a tu sitio (`https://tu-proyecto.vercel.app`) e iniciá sesión con el
   usuario Administrador creado por el seed. **Cambiá la clave** desde
   Usuarios → tu usuario → Restablecer clave.

## 4. Estructura del proyecto

```
src/
├── app/
│   ├── login/              # Página de inicio de sesión
│   ├── votantes/           # Listado, alta, edición y mapa de votantes
│   ├── usuarios/           # Gestión de usuarios (solo Administrador)
│   └── api/                # Rutas API (votantes, usuarios, autenticación)
├── components/             # Componentes de interfaz reutilizables
├── lib/                    # Conexión a base de datos, roles, autenticación
└── middleware.ts           # Protección de rutas según sesión y rol
prisma/
├── schema.prisma           # Modelo de datos (Usuario, Votante)
└── seed.ts                 # Script para crear el usuario Administrador inicial
```

## 5. Datos gestionados

**Votante:** Credencial, Nombre, Apellido, Dirección, Teléfono, Ubicación GPS
(latitud/longitud), Observaciones.

**Usuario del sistema:** Nombre, Correo, Clave (encriptada), Rol.

## 6. Notas de seguridad

- Las claves de usuario se guardan encriptadas (bcrypt), nunca en texto plano.
- Todas las rutas de API verifican la sesión y el rol antes de leer o
  modificar datos, además de la protección a nivel de página.
- Cambiá `NEXTAUTH_SECRET` por un valor único y secreto en producción.

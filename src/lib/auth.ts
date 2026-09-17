import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        correo: { label: "Correo", type: "text" },
        clave: { label: "Clave", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.clave) {
          return null;
        }

        const usuario = await prisma.usuario.findUnique({
          where: { correo: credentials.correo.toLowerCase().trim() },
        });

        if (!usuario || !usuario.activo) {
          return null;
        }

        const claveValida = await bcrypt.compare(credentials.clave, usuario.clave);
        if (!claveValida) {
          return null;
        }

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.correo,
          rol: usuario.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as { rol: string }).rol;
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { rol?: string; id?: string }).rol = token.rol as string;
        (session.user as { rol?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

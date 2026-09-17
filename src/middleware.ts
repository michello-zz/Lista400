import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const rol = req.nextauth.token?.rol;

    // Solo el Administrador puede entrar a /usuarios
    if (pathname.startsWith("/usuarios") && rol !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/votantes", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/votantes/:path*", "/usuarios/:path*", "/dashboard/:path*"],
};

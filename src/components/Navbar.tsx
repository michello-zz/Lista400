"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ETIQUETAS_ROL } from "@/lib/roles";

type Props = {
  nombre: string;
  rol: string;
};

export default function Navbar({ nombre, rol }: Props) {
  const pathname = usePathname();

  const enlaces = [
    { href: "/votantes", label: "Votantes", visible: true },
    { href: "/votantes/mapa", label: "Mapa", visible: true },
    { href: "/usuarios", label: "Usuarios", visible: rol === "ADMINISTRADOR" },
  ];

  return (
    <header className="bg-brand-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-white text-brand-800 rounded-full w-8 h-8 flex items-center justify-center text-sm">
              400
            </span>
            Lista 400
          </div>
          <nav className="hidden sm:flex gap-4 text-sm">
            {enlaces
              .filter((e) => e.visible)
              .map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  className={`px-2 py-1 rounded transition ${
                    pathname === e.href || (pathname?.startsWith(e.href) && e.href !== "/votantes")
                      ? "bg-brand-600"
                      : "hover:bg-brand-700"
                  }`}
                >
                  {e.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="text-right hidden sm:block">
            <div className="font-medium">{nombre}</div>
            <div className="text-brand-200 text-xs">
              {ETIQUETAS_ROL[rol as keyof typeof ETIQUETAS_ROL] || rol}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-brand-600 hover:bg-brand-500 rounded-lg px-3 py-1.5 transition"
          >
            Salir
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex gap-2 px-4 pb-2 text-sm">
        {enlaces
          .filter((e) => e.visible)
          .map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="bg-brand-700 rounded px-2 py-1"
            >
              {e.label}
            </Link>
          ))}
      </nav>
    </header>
  );
}

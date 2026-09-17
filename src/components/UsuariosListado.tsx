"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Usuario } from "@/types";
import { ETIQUETAS_ROL } from "@/lib/roles";

export default function UsuariosListado({ idPropio }: { idPropio?: string }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const res = await fetch("/api/usuarios");
    if (res.ok) {
      setUsuarios(await res.json());
    } else {
      setError("No se pudieron cargar los usuarios.");
    }
    setCargando(false);
  }

  async function eliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminar al usuario ${nombre}?`)) return;
    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "No se pudo eliminar el usuario.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div />
        <Link
          href="/usuarios/nuevo"
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg px-4 py-2 transition"
        >
          + Nuevo usuario
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              )}
              {!cargando &&
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {u.nombre} {u.id === idPropio && <span className="text-xs text-gray-400">(vos)</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.correo}</td>
                    <td className="px-4 py-3">
                      <span className="bg-brand-50 text-brand-700 rounded-full px-2 py-0.5 text-xs font-medium">
                        {ETIQUETAS_ROL[u.rol]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.activo ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-gray-400">Inactivo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/usuarios/${u.id}`}
                        className="text-brand-600 hover:text-brand-700 mr-3"
                      >
                        Editar
                      </Link>
                      {u.id !== idPropio && (
                        <button
                          onClick={() => eliminar(u.id, u.nombre)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

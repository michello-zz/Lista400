"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Votante } from "@/types";

type Props = {
  puedeEditar: boolean;
};

export default function VotantesListado({ puedeEditar }: Props) {
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async (q: string) => {
    setCargando(true);
    const res = await fetch(`/api/votantes${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    if (res.ok) {
      setVotantes(await res.json());
      setError("");
    } else {
      setError("No se pudieron cargar los votantes.");
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar("");
  }, [cargar]);

  useEffect(() => {
    const timeout = setTimeout(() => cargar(busqueda), 350);
    return () => clearTimeout(timeout);
  }, [busqueda, cargar]);

  async function eliminar(id: string, nombreCompleto: string) {
    if (!confirm(`¿Eliminar al votante ${nombreCompleto}? Esta acción no se puede deshacer.`)) {
      return;
    }
    const res = await fetch(`/api/votantes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setVotantes((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert("No se pudo eliminar el votante.");
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por credencial, nombre, apellido o dirección..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-96 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {puedeEditar && (
          <Link
            href="/votantes/nuevo"
            className="bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg px-4 py-2 text-center transition whitespace-nowrap"
          >
            + Nuevo votante
          </Link>
        )}
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
                <th className="px-4 py-3">Credencial</th>
                <th className="px-4 py-3">Nombre y apellido</th>
                <th className="px-4 py-3">Dirección</th>
                <th className="px-4 py-3">Teléfono</th>
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
              {!cargando && votantes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No se encontraron votantes.
                  </td>
                </tr>
              )}
              {!cargando &&
                votantes.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{v.credencial}</td>
                    <td className="px-4 py-3">
                      {v.apellido}, {v.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{v.direccion || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{v.telefono || "—"}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {puedeEditar ? (
                        <>
                          <Link
                            href={`/votantes/${v.id}`}
                            className="text-brand-600 hover:text-brand-700 mr-3"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => eliminar(v.id, `${v.nombre} ${v.apellido}`)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <Link
                          href={`/votantes/${v.id}`}
                          className="text-brand-600 hover:text-brand-700"
                        >
                          Ver
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {!cargando && `${votantes.length} votante(s) encontrado(s)`}
      </p>
    </div>
  );
}

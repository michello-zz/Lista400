"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario } from "@/types";
import { ROLES, ETIQUETAS_ROL, Rol } from "@/lib/roles";

type Props = {
  usuario?: Usuario;
};

export default function UsuarioForm({ usuario }: Props) {
  const router = useRouter();
  const esEdicion = Boolean(usuario);

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [rol, setRol] = useState<Rol>(usuario?.rol || "CONSULTA");
  const [activo, setActivo] = useState(usuario?.activo ?? true);
  const [clave, setClave] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const url = esEdicion ? `/api/usuarios/${usuario!.id}` : "/api/usuarios";
    const method = esEdicion ? "PUT" : "POST";
    const body = esEdicion
      ? { nombre, correo, rol, activo }
      : { nombre, correo, rol, clave };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Ocurrió un error al guardar.");
      setCargando(false);
      return;
    }

    setCargando(false);
    router.push("/usuarios");
    router.refresh();
  }

  async function handleCambiarClave(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;
    setError("");

    const res = await fetch(`/api/usuarios/${usuario.id}/clave`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: nuevaClave }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo cambiar la clave.");
      return;
    }

    setNuevaClave("");
    alert("Clave actualizada correctamente.");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value as Rol)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ETIQUETAS_ROL[r]}
              </option>
            ))}
          </select>
        </div>

        {!esEdicion && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clave inicial *</label>
            <input
              type="password"
              required
              minLength={6}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        )}

        {esEdicion && (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="rounded border-gray-300"
            />
            Usuario activo (puede iniciar sesión)
          </label>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={cargando}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium rounded-lg px-4 py-2 transition"
          >
            {cargando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear usuario"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/usuarios")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-4 py-2 transition"
          >
            Cancelar
          </button>
        </div>
      </form>

      {esEdicion && (
        <form onSubmit={handleCambiarClave} className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="font-medium text-gray-900">Restablecer clave</h2>
          <input
            type="password"
            minLength={6}
            required
            value={nuevaClave}
            onChange={(e) => setNuevaClave(e.target.value)}
            placeholder="Nueva clave (mínimo 6 caracteres)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg px-4 py-2 transition"
          >
            Actualizar clave
          </button>
        </form>
      )}
    </div>
  );
}

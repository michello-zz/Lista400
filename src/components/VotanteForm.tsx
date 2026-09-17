"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Votante } from "@/types";

type Props = {
  votante?: Votante;
};

export default function VotanteForm({ votante }: Props) {
  const router = useRouter();
  const esEdicion = Boolean(votante);

  const [form, setForm] = useState({
    credencial: votante?.credencial || "",
    nombre: votante?.nombre || "",
    apellido: votante?.apellido || "",
    direccion: votante?.direccion || "",
    telefono: votante?.telefono || "",
    gpsLat: votante?.gpsLat?.toString() || "",
    gpsLng: votante?.gpsLng?.toString() || "",
    observaciones: votante?.observaciones || "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  function actualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function obtenerUbicacionActual() {
    if (!navigator.geolocation) {
      setError("Este navegador no soporta geolocalización.");
      return;
    }
    setObteniendoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        actualizar("gpsLat", pos.coords.latitude.toFixed(6));
        actualizar("gpsLng", pos.coords.longitude.toFixed(6));
        setObteniendoUbicacion(false);
      },
      () => {
        setError("No se pudo obtener la ubicación actual.");
        setObteniendoUbicacion(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const url = esEdicion ? `/api/votantes/${votante!.id}` : "/api/votantes";
    const method = esEdicion ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setCargando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Ocurrió un error al guardar.");
      return;
    }

    router.push("/votantes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Campo
          label="Credencial *"
          value={form.credencial}
          onChange={(v) => actualizar("credencial", v)}
          required
        />
        <Campo
          label="Teléfono"
          value={form.telefono}
          onChange={(v) => actualizar("telefono", v)}
        />
        <Campo
          label="Nombre *"
          value={form.nombre}
          onChange={(v) => actualizar("nombre", v)}
          required
        />
        <Campo
          label="Apellido *"
          value={form.apellido}
          onChange={(v) => actualizar("apellido", v)}
          required
        />
      </div>

      <Campo
        label="Dirección"
        value={form.direccion}
        onChange={(v) => actualizar("direccion", v)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ubicación GPS
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Latitud"
            value={form.gpsLat}
            onChange={(e) => actualizar("gpsLat", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="text"
            placeholder="Longitud"
            value={form.gpsLng}
            onChange={(e) => actualizar("gpsLng", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="button"
          onClick={obtenerUbicacionActual}
          disabled={obteniendoUbicacion}
          className="mt-2 text-sm text-brand-600 hover:text-brand-700 disabled:opacity-60"
        >
          {obteniendoUbicacion ? "Obteniendo ubicación..." : "📍 Usar mi ubicación actual"}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          value={form.observaciones}
          onChange={(e) => actualizar("observaciones", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

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
          {cargando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear votante"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/votantes")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-4 py-2 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}

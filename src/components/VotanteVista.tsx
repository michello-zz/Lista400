import Link from "next/link";
import { Votante } from "@/types";

export default function VotanteVista({ votante }: { votante: Votante }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dato label="Credencial" valor={votante.credencial} />
        <Dato label="Teléfono" valor={votante.telefono || "—"} />
        <Dato label="Nombre" valor={votante.nombre} />
        <Dato label="Apellido" valor={votante.apellido} />
      </div>
      <Dato label="Dirección" valor={votante.direccion || "—"} />
      <Dato
        label="Ubicación GPS"
        valor={
          votante.gpsLat && votante.gpsLng
            ? `${votante.gpsLat}, ${votante.gpsLng}`
            : "No registrada"
        }
      />
      <Dato label="Observaciones" valor={votante.observaciones || "—"} />

      <Link
        href="/votantes"
        className="inline-block mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-4 py-2 transition"
      >
        Volver
      </Link>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
      <div className="text-gray-900">{valor}</div>
    </div>
  );
}

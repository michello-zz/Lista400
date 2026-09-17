import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "@/lib/auth";
import { puedeEditarVotantes } from "@/lib/roles";

// Leaflet depende de `window`, por lo que el mapa se carga solo en el cliente.
const MapaVotantes = dynamic(() => import("@/components/MapaVotantes"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] flex items-center justify-center text-gray-400 bg-white rounded-xl shadow">
      Cargando mapa...
    </div>
  ),
});

export default async function MapaPage() {
  const session = await getServerSession(authOptions);
  const puedeEditar = puedeEditarVotantes(session?.user.rol);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Mapa de votantes
      </h1>
      <MapaVotantes puedeEditar={puedeEditar} />
    </div>
  );
}

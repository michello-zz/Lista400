"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Votante } from "@/types";

// Ícono personalizado en forma de pin que muestra la credencial como referencia
function crearIconoCredencial(credencial: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div class="icono-credencial">${credencial}</div>
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #1f56f0;margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [20, 30],
  });
}

const CENTRO_POR_DEFECTO: [number, number] = [-32.5228, -55.7658]; // Uruguay (centro aproximado)

export default function MapaVotantes({ puedeEditar }: { puedeEditar: boolean }) {
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/votantes")
      .then((res) => res.json())
      .then((data: Votante[]) => setVotantes(data))
      .finally(() => setCargando(false));
  }, []);

  const conUbicacion = votantes.filter(
    (v) => v.gpsLat !== null && v.gpsLng !== null
  );

  const centro: [number, number] =
    conUbicacion.length > 0
      ? [conUbicacion[0].gpsLat as number, conUbicacion[0].gpsLng as number]
      : CENTRO_POR_DEFECTO;

  if (cargando) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-gray-400 bg-white rounded-xl shadow">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <MapContainer
        center={centro}
        zoom={conUbicacion.length > 0 ? 12 : 7}
        style={{ height: "70vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {conUbicacion.map((v) => (
          <Marker
            key={v.id}
            position={[v.gpsLat as number, v.gpsLng as number]}
            icon={crearIconoCredencial(v.credencial)}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <div className="font-semibold text-gray-900">
                  {v.apellido}, {v.nombre}
                </div>
                <div>
                  <span className="text-gray-400">Credencial: </span>
                  {v.credencial}
                </div>
                {v.direccion && (
                  <div>
                    <span className="text-gray-400">Dirección: </span>
                    {v.direccion}
                  </div>
                )}
                {v.telefono && (
                  <div>
                    <span className="text-gray-400">Teléfono: </span>
                    {v.telefono}
                  </div>
                )}
                {v.observaciones && (
                  <div>
                    <span className="text-gray-400">Observaciones: </span>
                    {v.observaciones}
                  </div>
                )}
                <Link
                  href={`/votantes/${v.id}`}
                  className="text-brand-600 hover:text-brand-700 inline-block pt-1"
                >
                  {puedeEditar ? "Editar ficha →" : "Ver ficha →"}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="px-4 py-2 text-xs text-gray-400 border-t">
        {conUbicacion.length} de {votantes.length} votante(s) con ubicación registrada.
      </div>
    </div>
  );
}

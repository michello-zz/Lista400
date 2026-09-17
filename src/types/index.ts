export type Votante = {
  id: string;
  credencial: string;
  nombre: string;
  apellido: string;
  direccion: string | null;
  telefono: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  rol: "ADMINISTRADOR" | "OPERADOR" | "CONSULTA";
  activo: boolean;
  createdAt: string;
};

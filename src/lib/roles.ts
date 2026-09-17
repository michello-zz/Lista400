// Definición centralizada de roles y qué puede hacer cada uno.
// Administrador: gestiona todo, incluidos los usuarios del sistema.
// Operador: ingresa, modifica, elimina y lista votantes (no gestiona usuarios).
// Consulta: solo puede visualizar los datos de votantes.

export type Rol = "ADMINISTRADOR" | "OPERADOR" | "CONSULTA";

export const ROLES: Rol[] = ["ADMINISTRADOR", "OPERADOR", "CONSULTA"];

export const ETIQUETAS_ROL: Record<Rol, string> = {
  ADMINISTRADOR: "Administrador",
  OPERADOR: "Operador",
  CONSULTA: "Consulta",
};

export function puedeGestionarUsuarios(rol?: string | null): boolean {
  return rol === "ADMINISTRADOR";
}

export function puedeEditarVotantes(rol?: string | null): boolean {
  return rol === "ADMINISTRADOR" || rol === "OPERADOR";
}

export function puedeVerVotantes(rol?: string | null): boolean {
  return rol === "ADMINISTRADOR" || rol === "OPERADOR" || rol === "CONSULTA";
}

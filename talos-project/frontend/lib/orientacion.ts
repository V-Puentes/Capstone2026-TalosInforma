import type { Orientacion } from "./types";

export const ORIENTACIONES: Orientacion[] = ["Left", "Center", "Right"];

export const NOMBRE: Record<Orientacion, string> = {
  Left: "Izquierda",
  Center: "Centro",
  Right: "Derecha",
};

/* Clases completas para que Tailwind las detecte al compilar */
export const FONDO: Record<Orientacion, string> = {
  Left: "bg-rose-600",
  Center: "bg-slate-500",
  Right: "bg-sky-700",
};

export const TEXTO: Record<Orientacion, string> = {
  Left: "text-rose-700",
  Center: "text-slate-700",
  Right: "text-sky-800",
};

export const BORDE: Record<Orientacion, string> = {
  Left: "border-rose-200",
  Center: "border-slate-200",
  Right: "border-sky-200",
};

export const SUAVE: Record<Orientacion, string> = {
  Left: "bg-rose-50",
  Center: "bg-slate-50",
  Right: "bg-sky-50",
};

export const HEX: Record<Orientacion, string> = {
  Left: "#e11d48",
  Center: "#64748b",
  Right: "#0369a1",
};

export function formatoFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

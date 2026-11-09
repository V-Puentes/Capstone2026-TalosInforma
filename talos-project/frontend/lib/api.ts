import type { EventoDetalle, EventoFeed, EstadisticaMedio, ReporteAdmin } from "./types";

export const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(public status: number) {
    super(`Error ${status}`);
  }
}

async function get<T>(ruta: string, token?: string): Promise<T> {
  const r = await fetch(`${API}${ruta}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!r.ok) throw new ApiError(r.status);
  return (await r.json()) as T;
}

export const api = {
  feed: (dias = 60) => get<EventoFeed[]>(`/events/feed?dias=${dias}&limite=100`),
  evento: (id: string) => get<EventoDetalle>(`/events/${encodeURIComponent(id)}`),
  medios: () => get<EstadisticaMedio[]>("/stats/medios"),
  reportar: async (noticia_id: string, motivo: string) => {
    const r = await fetch(`${API}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noticia_id, motivo }),
    });
    if (!r.ok) throw new ApiError(r.status);
  },
  login: async (email: string, password: string): Promise<string> => {
    const r = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) throw new ApiError(r.status);
    const datos = (await r.json()) as { access_token: string };
    return datos.access_token;
  },
  reportes: (token: string) => get<ReporteAdmin[]>("/admin/reports", token),
};

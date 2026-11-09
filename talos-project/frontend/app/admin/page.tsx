"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { ReporteAdmin } from "@/lib/types";
import { formatoFecha } from "@/lib/orientacion";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reportes, setReportes] = useState<ReporteAdmin[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function cargar(t: string) {
    try {
      setReportes(await api.reportes(t));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setToken(null);
        setError("La sesión expiró. Vuelve a ingresar.");
      } else setError("No se pudieron cargar los reportes.");
    }
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const t = await api.login(email, password);
      setToken(t);
      setPassword("");
      await cargar(t);
    } catch {
      setError("Credenciales inválidas o servidor no disponible.");
    } finally {
      setCargando(false);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-2xl font-extrabold text-gray-900">Administración</h1>
        <form onSubmit={entrar} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <label className="block text-sm font-medium text-gray-800">
            Correo
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Contraseña
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
          <button type="submit" disabled={cargando}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60">
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Reportes de usuarios</h1>
        <button type="button" onClick={() => { setToken(null); setReportes(null); }} className="text-sm text-gray-600 hover:underline">
          Cerrar sesión
        </button>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
      {reportes && reportes.length === 0 && <p className="mt-6 text-gray-600">No hay reportes pendientes.</p>}
      {reportes && reportes.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <tr><th className="p-3">Fecha</th><th className="p-3">Noticia</th><th className="p-3">Motivo</th></tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 last:border-0 align-top">
                  <td className="whitespace-nowrap p-3 text-gray-600">{formatoFecha(r.fecha)}</td>
                  <td className="p-3"><a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:underline">{r.titulo}</a></td>
                  <td className="p-3 text-gray-700">{r.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
